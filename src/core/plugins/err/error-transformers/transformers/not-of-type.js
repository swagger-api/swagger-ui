export function transform(errors) {
  // JSONSchema refers to the current object being validated
  // as 'instance'. This isn't helpful to users, so we remove it.
  return errors
    .map(err => {
      let seekStr = "is not of a type(s)"
      let i = err.get("message").indexOf(seekStr)
      if(i > -1) {
        let types = err.get("message").slice(i + seekStr.length).split(",")
        return err.set("message", err.get("message").slice(0, i) + makeNewMessage(types))
      } else {
        return err
      }
    })
}

function makeNewMessage(types) {
  return types.reduce((p, c, i, arr) => {
    if(i === arr.length - 1 && arr.length > 1) {
      return p + "or " + c
    } else if(arr[i+1] && arr.length > 2) {
      return p + c + ", "
    } else if(arr[i+1]) {
      return p + c + " "
    } else {
      return p + c
    }
  }, "should be a")
}
