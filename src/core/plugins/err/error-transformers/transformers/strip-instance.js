export function transform(errors) {
  return errors
    .map(err => {
      return err.set("message", removeSubstring(err.get("message"), "instance."))
    })
}

function removeSubstring(str, substr) {
  return str.replace(new RegExp(substr, "g"), "")
}
