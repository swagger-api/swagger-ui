import { setHash } from "./helpers"

export const show = (ori, system) => (...args) => {
  ori(...args)
  try {
    let [thing, shown] = args
    let [type] = thing

    if(type === "operations-tag" || type === "operations") {
      if(!shown) {
        return setHash("/")
      }

      if(type === "operations") {
        let [, operationId, tag] = thing
        setHash(`/${tag}/${operationId}`)
      }

      if(type === "operations-tag") {
        let [, tag] = thing
        setHash(`/${tag}`)
      }
    }

  } catch(e) {
    // This functionality is not mission critical, so if something goes wrong
    // we'll just move on
    console.error(e)
  }
}
