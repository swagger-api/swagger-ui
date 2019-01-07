export function transform(errors) {
  return errors
    .map(err => {
      if(err.get("type") === "schema") {
        return err.set("message", removeSubstring(err.get("message"), "instance\\."))
      } else {
        return err
      }
    })
}

function removeSubstring(str, substr) {
  return str.replace(new RegExp(substr, "g"), "")
}
