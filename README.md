# lightning-viz

This a visualizer for the Bitcoin Lightning Network. It can apply to mainnet or testnet depending what mode LND is running under.

Lightning-viz supports advanced node querying (enter `query:` into the search bar) and remapping of the graph based on the node search results.

The server also periodically pings peers to determine their connectivity. The server collects geo-location data on nodes that have an address configured.

## Installation

lightning-viz requires LND 0.4.0-beta to be installed locally.

```
git clone https://github.com/altangent/lightning-viz
cd lightning-viz
npm install && npm run build
npm start
```
