export const setHash = (value) => {
  if(value) {
    return history.pushState(null, null, `#${value}`)
  } else {
    return window.location.hash = ""
  }
}
