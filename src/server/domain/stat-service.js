const statMapper = require('../data/stat-mapper');
const dateUtils = require('../utils/date-utils');
const stats = require('./stats');

module.exports = {
  getCurrentStats,
};

async function getCurrentStats() {
  let timestamp = dateUtils.now();
  let result = {};
  for (let key of Object.keys(stats)) {
    result[key] = await statMapper.getStat(key, timestamp);
  }
  return result;
}
