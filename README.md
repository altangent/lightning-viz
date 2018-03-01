# lightning-viz

This a visualizer for the Bitcoin Lightning Network. It can apply to mainnet or testnet depending what mode LND is running under.

The server periodically attempt to connect to peers to determing whether they are reachable. The server will also collect geo-location information on nodes that have addresses configured.

## Installation

LND Explorer requires LND 0.3-alpha as of Feb 24, 2018 commit e5f9b28e395507d860fb2d08c2f01f5889c14e39.

Run LND Explorer against a local installation on LND:

```
git clone https://github.com/altangent/lightning-viz
cd lightning-viz
npm install && npm run build
npm start
```
