const http = require('http');

module.exports = {
  getHostGeoInfo,
};

async function getHostGeoInfo(ip) {
  return await getRemoteInfo(ip);
}

function getRemoteInfo(ip) {
  return new Promise((resolve, reject) => {
    let req = http.request(
      {
        host: 'freegeoip.net',
        path: '/json/' + ip,
        method: 'get',
      },
      res => {
        let buffers = [];
        res.on('data', data => buffers.push(data));
        res.on('end', () => {
          let raw = Buffer.concat(buffers).toString();
          res.statusCode === 200 ? resolve(JSON.parse(raw)) : reject(raw);
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}
