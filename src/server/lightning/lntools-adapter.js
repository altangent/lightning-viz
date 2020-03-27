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
    localSecret: Buffer.from(
      'c84985781fee4676a616f81399d28cced95a691a983c582b6285108e02830673',
      'hex'
    ),
    network: 'BitcoinTestnet',
    bitcoindHost: 'localhost',
    bitcoindPort: 18332,
    bitcoindRpcUser: 'kek',
    bitcoindRpcPassword: 'kek',
    bitcoindZmqRawBlocks: 'tcp://127.0.0.1:38333',
    bitcoindZmqRawTx: 'tcp://127.0.0.1:38332',
  });
  _instance = lntools;

  // lntg.on('flushed', () => lntg.logger.info('flushed'));
  lntools.on('channel_created', scid => lntools.logger.info('chan_created', scid.toString()));
  lntools.on('channel_removed', scid => lntools.logger.info('chan_removed', scid.toString()));
  lntools.on('node', nodeId => lntools.logger.info('node_updated', nodeId.toString('hex').substring(0, 16))); // prettier-ignore

  await lntools.start();
  await lntools.connectToPeer(
    '036b96e4713c5f84dcb8030592e1bd42a2d9a43d91fa2e535b9bfd05f2c5def9b9',
    '38.87.54.163',
    9745
  );
}
