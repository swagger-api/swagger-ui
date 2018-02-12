import focus from "./focus.js"


export const updateResolved = (ori, { layoutActions, getConfigs }) => (...args) => {
  ori(...args)
  focus(layoutActions, getConfigs)
}
