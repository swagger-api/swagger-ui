// This uses experimental console methods, to track performance

module.exports = {
  start(str) {
    /* develblock:start */
    // eslint-disable-next-line no-console
    console.time(str)
    /* develblock:end */
  },
  stop(str) {
    /* develblock:start */
    // eslint-disable-next-line no-console
    console.timeEnd(str)
    /* develblock:end */
  }
}
