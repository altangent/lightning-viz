const lnd = require('./lnd-adapter');
const lntools = require('./lntools-adapter');

let mode = process.env.CLIENT;
module.exports = mode === 'LND' ? lnd : lntools;
