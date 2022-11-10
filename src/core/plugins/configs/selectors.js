// Just get the config value ( it can possibly be an immutable object)
export const get = (state, path) => {
  return state.getIn(Array.isArray(path) ? path : [path])
}
