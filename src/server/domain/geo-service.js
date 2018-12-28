const winston = require('winston');
const https = require('https');

module.exports = {
  getHostGeoInfo,
};

async function getHostGeoInfo(ip) {
  return await getRemoteInfo(ip);
}

function getRemoteInfo(ip) {
  return new Promise((resolve, reject) => {
    let req = https.request(
      {
        host: 'freegeoip.app',
        path: '/json/' + ip,
        method: 'get',
      },
      res => {
        let buffers = [];
        res.on('data', data => buffers.push(data));
        res.on('end', () => {
          let raw = Buffer.concat(buffers).toString();
          if (res.statusCode === 200) {
            return resolve(JSON.parse(raw));
          } else {
            winston.warn('geoip failed for ' + ip);
            return reject(raw);
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}
