module.exports = {
  splitAddr,
};

function splitAddr(addr) {
  let portStr = addr.match(/:\d{2,}$/)[0];
  let port = parseInt(portStr.substr(1));
  let host = addr.substring(0, addr.length - portStr.length).replace(/[\[\]]/g, '');
  return [host, port];
}
