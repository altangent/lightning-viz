# lightning-viz

This a visualizer for the Bitcoin Lightning Network. The visualizer can directly connect to the
Lightning Network using [LNTools](https://github.com/altangent/lntools)!

Lightning-viz supports advanced node querying (enter `query:` into the search bar) and remapping of the graph based on the node search results.

The server also periodically pings peers to determine their connectivity. The server collects geo-location data on nodes that have an address configured.

## Installation

Requires Node 10+.

```
git clone https://github.com/altangent/lightning-viz
cd lightning-viz
npm install && npm run build
```

## Running with LNTools

[LNTools](https://github.com/altangent/lntools) is a group of libraries that implement the
Lighting Network BOLT specifications. With LNTools, a process can directly connect to other
nodes and store gossip traffic in a RocksDB database.

### Node Process

```bash
LNTOOLS_NETWORK=BitcoinTestnet \
LNTOOLS_BITCOIND_HOST=127.0.0.1 \
LNTOOLS_BITCOIND_PORT=18332 \
LNTOOLS_BITCOIND_RPCUSER=kek \
LNTOOLS_BITCOIND_RPCPASSWORD=kek \
LNTOOLS_BITCOIND_ZMQRAWBLOCKS=tcp://127.0.0.1:38333 \
LNTOOLS_BITCOIND_ZMQRAWTX=tcp://host.docker.internal:38332 \
LNTOOLS_PEER_PUBKEY=036b96e4713c5f84dcb8030592e1bd42a2d9a43d91fa2e535b9bfd05f2c5def9b9 \
LNTOOLS_PEER_HOST=38.87.54.163 \
LNTOOLS_PEER_PORT=9745 \
HTTP_PORT=8000 \
npm start
```

### Docker

```bash
docker run \
    -e LNTOOLS_NETWORK=BitcoinTestnet \
    -e LNTOOLS_BITCOIND_HOST=host.docker.internal \
    -e LNTOOLS_BITCOIND_PORT=18332 \
    -e LNTOOLS_BITCOIND_RPCUSER=kek \
    -e LNTOOLS_BITCOIND_RPCPASSWORD=kek \
    -e LNTOOLS_BITCOIND_ZMQRAWBLOCKS=tcp://host.docker.internal:38333 \
    -e LNTOOLS_BITCOIND_ZMQRAWTX=tcp://host.docker.internal:38332 \
    -e LNTOOLS_PEER_PUBKEY=036b96e4713c5f84dcb8030592e1bd42a2d9a43d91fa2e535b9bfd05f2c5def9b9 \
    -e LNTOOLS_PEER_HOST=38.87.54.163 \
    -e LNTOOLS_PEER_PORT=9745 \
    -e HTTP_PORT=8000 \
    -v /somepath/lightning-viz/data:/usr/src/app/data \
    -p 8000:8000 \
    --name lnviz \
    -d \
    altangent/lnviz
```

## Running with LND

Lightning-viz can also connect to an LND instance using the [lnd-async](https://github.com/altangent/lnd-async) library. You may need to pass environment variables supported by lnd-async to control LND behavior.

You will need to supply the `CLIENT=LND` environment variable.

```
CLIENT=LND npm start
```
