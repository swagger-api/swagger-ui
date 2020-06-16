import YAML from "js-yaml"

export const parseYamlConfig = (yaml, system) => {
  try {
    return YAML.safeLoad(yaml)
  } catch(e) {
    if (system) {
      system.errActions.newThrownErr( new Error(e) )
    }
    return {}
  }
}
