export default function ({configs}) {

  const levels = {
    "debug": 0,
    "info": 1,
    "log": 2,
    "warn": 3,
    "error": 4
  }

  const getLevel = (level) => levels[level] || -1

  let { logLevel } = configs
  let logLevelInt = getLevel(logLevel)

  function log(level, ...args) {
    if(getLevel(level) >= logLevelInt)
    // eslint-disable-next-line no-console
      console[level](...args)
  }

  log.warn = log.bind(null, "warn")
  log.error = log.bind(null, "error")
  log.info = log.bind(null, "info")
  log.debug = log.bind(null, "debug")

  return { rootInjects: { log } }
}
