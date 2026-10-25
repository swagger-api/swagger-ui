export const setHash = (value) => {
  if(value) {
    // Include the current pathname and search explicitly so that a
    // document-level `<base href>` (set by frameworks like Angular) does not
    // cause `pushState` to resolve `#value` against the base URL and replace
    // the current route. See https://github.com/swagger-api/swagger-ui/issues/10591
    const { pathname, search } = window.location
    return history.pushState(null, null, `${pathname}${search}#${value}`)
  } else {
    return window.location.hash = ""
  }
}
