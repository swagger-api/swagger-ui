export const show = (ori, system) => (...args) => {
  ori(...args)
  try {
    let [thing, shown] = args
    let [type] = thing

    if(type === "operations-tag" || type === "operations") {
      if(!shown) {
        return window.location.hash = ""
      }

      if(type === "operations") {
        let [, operationId, tag] = thing
        window.location.hash = `/${tag}/${operationId}`
      }

      if(type === "operations-tag") {
        let [, tag] = thing
        window.location.hash = `/${tag}`
      }
    }

  } catch(e) {
    // This functionality is not mission critical, so if something goes wrong
    // we'll just move on
    console.error(e)
  }
}
