/**
 * @prettier
 */
import win from "core/window"

const afterLoad = () => {
  // eslint-disable-next-line no-undef
  const { GIT_DIRTY, GIT_COMMIT, PACKAGE_VERSION, BUILD_TIME } = buildInfo

  win.versions = win.versions || {}
  win.versions.swaggerUI = {
    version: PACKAGE_VERSION,
    gitRevision: GIT_COMMIT,
    gitDirty: GIT_DIRTY,
    buildTimestamp: BUILD_TIME,
  }
}

export default afterLoad
