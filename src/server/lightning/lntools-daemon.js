const { EventEmitter } = require('events');
const { BitcoindClient } = require('@lntools/bitcoind');
const { TxWatcher } = require('@lntools/chainmon');
const { RocksdbGossipStore } = require('@lntools/gossip-rocksdb');
const { GraphManager, LndSerializer } = require('@lntools/graph');
const { ConsoleTransport, Logger, LogLevel } = require('@lntools/logger');
const { Peer, InitMessage, GossipManager, GossipMemoryStore } = require('@lntools/wire');

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

    const chainClient = new BitcoindClient({
      host: opts.bitcoindHost,
      port: opts.bitcoindPort,
      rpcuser: opts.bitcoindRpcUser,
      rpcpassword: opts.bitcoindRpcPassword,
      zmqpubrawblock: opts.bitcoindZmqRawBlocks,
      zmqpubrawtx: opts.bitcoindZmqRawTx,
    });
    this.chainClient = chainClient;

    const gossipStore = new RocksdbGossipStore(this.dbpath);
    const pendingStore = new GossipMemoryStore();
    const gossipManager = new GossipManager({
      chainHash: this.chainHash,
      logger,
      gossipStore,
      pendingStore,
      chainClient: this.chainClient,
    });
    this.gossipStore = gossipStore;
    this.gossipManager = gossipManager;

    const txWatcher = new TxWatcher(chainClient);
    this.txWatcher = txWatcher;

    const graphManager = new GraphManager(gossipManager);
    this.graphManager = graphManager;
  }

  async start() {
    const txWatcher = this.txWatcher;
    const gossipManager = this.gossipManager;
    const gossipStore = this.gossipStore;
    const graphManager = this.graphManager;

    // start the tx watcher looking for transactions
    txWatcher.start();

    gossipManager.on('error', err => this.emit('error', err));
    gossipManager.on('flushed', () => this.emit('flushed'));

    // watch for chan_ann message and have the tx watcher monitor for them
    gossipManager.on('message', async msg => {
      if (msg.outpoint) {
        txWatcher.watchOutpoint(msg.outpoint);
      }
    });

    txWatcher.on('outpointspent', async (tx, outpoint) => {
      const msg = await gossipStore.findChannelAnnouncementByOutpoint(outpoint);
      await gossipManager.removeChannel(msg.shortChannelId);
      this.emit('channel_removed', msg.shortChannelId);
    });

    graphManager.on('node', node => this.emit('node', node.nodeId));
    graphManager.on('channel', channel => this.emit('channel_created', channel.shortChannelId));
    graphManager.on('error', err => this.emit('error', err));

    // starts the gossip manager
    await gossipManager.start();
  }

  connectToPeer(pubkey, host, port) {
    const logger = this.logger;
    const gossipManager = this.gossipManager;
    const initMessageFactory = () => {
      const initMessage = new InitMessage();
      initMessage.localInitialRoutingSync = false;
      initMessage.localDataLossProtect = true;
      initMessage.localGossipQueries = true;
      initMessage.localGossipQueriesEx = false;
      return initMessage;
    };

    // constructs the peer and attaches a logger for tthe peer.
    const peer = new Peer({
      ls: this.localSecret,
      rpk: Buffer.from(pubkey, 'hex'),
      host,
      port,
      logger,
      initMessageFactory,
    });
    peer.on('open', () => logger.info('connecting'));
    peer.on('error', err => logger.error('%s', err.stack));
    peer.on('ready', () => logger.info('peer is ready'));

    // add peer to gossip manager
    gossipManager.addPeer(peer);

    // connect to the peer
    peer.connect();
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
