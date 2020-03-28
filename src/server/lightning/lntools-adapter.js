const crypto = require('crypto');
const { LntoolsDaemon } = require('./lntools-daemon');

let _instance;

module.exports = {
  connect,

  get client() {
    return _instance;
  },

  async describeGraph() {
    return await _instance.describeGraph();
  },
};

async function connect() {
  const lntools = new LntoolsDaemon({
    localSecret: crypto.randomBytes(32),
    network: process.env.LNTOOLS_NETWORK, // 'BitcoinTestnet',
    bitcoindHost: process.env.LNTOOLS_BITCOIND_HOST, // 'localhost',
    bitcoindPort: process.env.LNTOOLS_BITCOIND_PORT, // 18332,
    bitcoindRpcUser: process.env.LNTOOLS_BITCOIND_RPCUSER, // 'kek',
    bitcoindRpcPassword: process.env.LNTOOLS_BITCOIND_RPCPASSWORD, // 'kek',
    bitcoindZmqRawBlocks: process.env.LNTOOLS_BITCOIND_ZMQRAWBLOCKS, // 'tcp://127.0.0.1:38333',
    bitcoindZmqRawTx: process.env.LNTOOLS_BITCOIND_ZMQRAWTX, // 'tcp://127.0.0.1:38332',
  });
  _instance = lntools;

  // lntg.on('flushed', () => lntg.logger.info('flushed'));
  lntools.on('channel_created', scid => lntools.logger.info('chan_created', scid.toString()));
  lntools.on('channel_removed', scid => lntools.logger.info('chan_removed', scid.toString()));
  lntools.on('node', nodeId => lntools.logger.info('node_updated', nodeId.toString('hex').substring(0, 16))); // prettier-ignore
  lntools.on('error', err => lntools.logger.error(err));

  await lntools.start();
  await lntools.connectToPeer(
    process.env.LNTOOLS_PEER_PUBKEY, // '036b96e4713c5f84dcb8030592e1bd42a2d9a43d91fa2e535b9bfd05f2c5def9b9',
    process.env.LNTOOLS_PEER_HOST, // '38.87.54.163',
    process.env.LNTOOLS_PEER_PORT // 9745
  );
}
