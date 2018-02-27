const winston = require('winston');
const lnd = require('../lnd');
const channelStats = require('./stats/channel-stats');
const statMapper = require('../data/stat-mapper');
const dateUtils = require('../utils/date-utils');
const stats = require('./stats');

module.exports = {
  collectStats,
};

async function collectStats() {
  winston.info('starting network statistic processing');
  winston.profile('processing network statistics');
  let graph = await lnd.client.describeGraph({});

  let timestamp = dateUtils.now();

  await statMapper.putStat(stats.node_count, timestamp, graph.nodes.length);
  await statMapper.putStat(stats.channel_count, timestamp, graph.edges.length);

  await statMapper.putStat(
    stats.max_channels_per_node,
    timestamp,
    channelStats.maxChannelsPerNode(graph)
  );

  await statMapper.putStat(
    stats.ave_channels_per_node,
    timestamp,
    channelStats.meanChannelsPerNode(graph)
  );

  await statMapper.putStat(
    stats.min_channel_capacity,
    timestamp,
    channelStats.channelMinCapacity(graph)
  );

  await statMapper.putStat(
    stats.max_channel_capacity,
    timestamp,
    channelStats.channelMaxCapacity(graph)
  );

  await statMapper.putStat(
    stats.ave_channel_capacity,
    timestamp,
    channelStats.channelCapacityMean(graph)
  );

  await statMapper.putStat(
    stats.channel_capacity_variance,
    timestamp,
    channelStats.channelCapacityVariance(graph)
  );

  winston.profile('processing network statistics');
}
