const { EventEmitter } = require('events');
const { BitcoindClient } = require('@node-lightning/bitcoind');
const { TxWatcher } = require('@node-lightning/chainmon');
const { RocksdbGossipStore } = require('@node-lightning/gossip-rocksdb');
const { GraphManager, LndSerializer } = require('@node-lightning/graph');
const { ConsoleTransport, Logger, LogLevel } = require('@node-lightning/logger');
const { Peer, InitFeatureFlags } = require('@node-lightning/wire');
const { GossipManager, GossipMemoryStore } = require('@node-lightning/wire');
const { MessageType } = require('@node-lightning/wire');
const { BitField } = require('@node-lightning/core');

class LntoolsDaemon extends EventEmitter {
  constructor(opts) {
    super();
    this.localSecret = opts.localSecret;
    switch (opts.network) {
      case 'BitcoinTestnet':
        this.chainHash = Buffer.from("43497fd7f826957108f4a30fd9cec3aeba79972084e90ead01ea330900000000", "hex"); // prettier-ignore
        this.dbpath = 'data/gossip';
        this.testnet = true;
        break;
      case 'BitcoinMainnet':
        this.chainHash = Buffer.from("6fe28c0ab6f1b372c1a6a246ae63f74f931e8365e15a089c68d6190000000000", "hex"); // prettier-ignore
        this.dbpath = 'data/gossip';
        this.testnet = false;
        break;
    }

    const logger = new Logger('lntools');
    logger.transports.push(new ConsoleTransport(console));
    logger.level = LogLevel.Debug;
    this.logger = logger;

    // constructs a new client to connect to bitcoind
    const chainClient = new BitcoindClient({
      host: opts.bitcoindHost,
      port: opts.bitcoindPort,
      rpcuser: opts.bitcoindRpcUser,
      rpcpassword: opts.bitcoindRpcPassword,
      zmqpubrawblock: opts.bitcoindZmqRawBlocks,
      zmqpubrawtx: opts.bitcoindZmqRawTx,
    });
    this.chainClient = chainClient;

    // construct data storage for gossip messages
    const gossipStore = new RocksdbGossipStore(this.dbpath);
    const pendingStore = new GossipMemoryStore();
    this.gossipStore = gossipStore;

    // constructs the gossip manager that handles orchestration of
    // gossip messsages from all peers
    const gossipManager = new GossipManager(logger, gossipStore, pendingStore, this.chainClient);
    this.gossipManager = gossipManager;

    // creates the transaction watcher that uses the zeromq bitcoind
    // client to watch for the spending of specific outpoints (txid:vout tuple)
    const txWatcher = new TxWatcher(chainClient);
    this.txWatcher = txWatcher;

    // creates a graph manager that receives gossip messages and construucts
    // a graph representation of the routing messages
    const graphManager = new GraphManager(gossipManager);
    this.graphManager = graphManager;
  }

  async start() {
    const txWatcher = this.txWatcher;
    const gossipManager = this.gossipManager;
    const gossipStore = this.gossipStore;
    const graphManager = this.graphManager;

    // start the tx watcher, which will connect to bitcoind and
    // listen for received transactions
    txWatcher.start();

    // when an outpoint is spent (we'll listen for them below), remove
    // the channel from the gossip database and the current graph view
    txWatcher.on('outpointspent', async (tx, outpoint) => {
      const msg = await gossipStore.findChannelAnnouncementByOutpoint(outpoint);
      await gossipManager.removeChannel(msg.shortChannelId);
      await graphManager.removeChannel(outpoint);
      this.emit('channel_removed', msg.shortChannelId);
    });

    // propagate messages recieved when the graph has added nodes or channels
    graphManager.on('node', node => this.emit('node', node.nodeId));
    graphManager.on('channel', channel => this.emit('channel_created', channel.shortChannelId));
    graphManager.on('error', err => this.emit('error', err));

    // when the gossip manager emits a new gossip message, we check to see if it
    // is a chan_ann message that has an outpoint. If it is, we add the outpoint to
    // the transaction watcher to check if it is trying to be spent.
    // The outpoint is attached during message validation when information is
    // retrieved from bitcoind.
    gossipManager.on('message', async msg => {
      if (msg.type === MessageType.ChannelAnnouncement && msg.outpoint) {
        txWatcher.watchOutpoint(msg.outpoint);
      }
    });
    gossipManager.on('error', err => this.emit('error', err));

    // starts the gossip manager which will restore all messages
    // from the gossip database, validate that they are still valid channels
    // and emit them so that the graph can be reconstructed
    await gossipManager.start();
  }

  connectToPeer(pubkey, host, port) {
    const logger = this.logger;
    const gossipManager = this.gossipManager;

    const localFeatures = new BitField();
    localFeatures.set(InitFeatureFlags.optionDataLossProtectRequired);
    localFeatures.set(InitFeatureFlags.gossipQueriesRequired);

    // constructs a new peer
    const peer = new Peer(this.localSecret, localFeatures, [this.chainHash], logger);
    peer.on('open', () => logger.info('connecting'));
    peer.on('error', err => this.emit('error', err));
    peer.on('ready', () => logger.info('peer is ready'));

    // add peer to gossip manager. This will initialize gossip
    // synchronization once that pear has connected and is ready.
    gossipManager.addPeer(peer);

    // connect to the peer!
    peer.connect(Buffer.from(pubkey, 'hex'), host, port);
  }

  describeGraph() {
    const serializer = new LndSerializer();
    const graph = serializer.toObject(this.graphManager.graph);

    graph.chains = ['Bitcoin'];
    graph.testnet = this.testnet;
    return graph;
  }
}

module.exports.LntoolsDaemon = LntoolsDaemon;
