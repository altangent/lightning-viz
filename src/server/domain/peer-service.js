const net = require('net');
const { splitAddr } = require('../utils/addr-utils');

module.exports = {
  checkPeerConnection,
};

function checkPeerConnection(peerAddress) {
  return new Promise(resolve => {
    const [host, port] = splitAddr(peerAddress);
    const socket = new net.Socket();

    socket.setTimeout(1000, () => {
      socket.end();
      resolve(false);
    });

    socket.on('connect', () => {
      socket.end();
      resolve(true);
    });

    socket.on('error', () => {
      socket.end();
      resolve(false);
    });

    socket.connect({
      host,
      port: parseInt(port) || 9735,
    });
  });
}
