export const UPDATE_CONFIGS = "configs_update"
export const TOGGLE_CONFIGS = "configs_toggle"

// Update the configs, with a merge ( not deep )
export function update(configName, configValue) {
  return {
    type: UPDATE_CONFIGS,
    payload: {
      [configName]: configValue
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
