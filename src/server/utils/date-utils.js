module.exports = {
  now,
};

function now() {
  let timestamp = new Date().getTime() / 1000;
  timestamp = timestamp - timestamp % 3600;
  return timestamp;
}
