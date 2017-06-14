export const UPDATE_CONFIGS = "configs_update"

// Update the configs, with a merge ( not deep )
export function update(configs) {
  return {
    type: UPDATE_CONFIGS,
    payload: configs,
  }
}
