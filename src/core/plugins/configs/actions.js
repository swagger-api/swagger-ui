/**
 * @prettier
 */
import { parseConfig } from "./fn"

export const UPDATE_CONFIGS = "configs_update"
export const TOGGLE_CONFIGS = "configs_toggle"

// Update the configs, with a merge ( not deep )
export function update(configName, configValue) {
  return {
    type: UPDATE_CONFIGS,
    payload: {
      [configName]: configValue,
    },
  }
}

// Toggle's the config, by name
export function toggle(configName) {
  return {
    type: TOGGLE_CONFIGS,
    payload: configName,
  }
}

// Hook
export const loaded = () => () => {
  // noop
}

export const downloadConfig = (req) => (system) => {
  const {
    fn: { fetch },
  } = system

  return fetch(req)
}

export const getConfigByUrl = (req, cb) => (system) => {
  const { specActions, configsActions } = system

  if (req) {
    return configsActions.downloadConfig(req).then(next, next)
  }

  function next(res) {
    if (res instanceof Error || res.status >= 400) {
      specActions.updateLoadingStatus("failedConfig")
      specActions.updateLoadingStatus("failedConfig")
      specActions.updateUrl("")
      console.error(res.statusText + " " + req.url)
      cb(null)
    } else {
      cb(parseConfig(res.text, system))
    }
  }
}
