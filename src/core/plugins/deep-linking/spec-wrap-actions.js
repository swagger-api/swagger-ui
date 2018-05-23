import focus from "./focus.js"


export const updateJsonSpec = (ori, { layoutActions, getConfigs }) => (...args) => {
  ori(...args)
  focus(layoutActions, getConfigs)
}
