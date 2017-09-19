import { setHash } from "./helpers"
import { createDeepLinkPath } from "core/utils"

export const show = (ori, { getConfigs }) => (...args) => {
  ori(...args)

  const isDeepLinkingEnabled = getConfigs().deepLinking
  if(!isDeepLinkingEnabled || isDeepLinkingEnabled === "false") {
    return
  }

  try {
    let [thing, shown] = args
    let [type] = thing

    if(type === "operations-tag" || type === "operations") {
      if(!shown) {
        return setHash("/")
      }

      if(type === "operations") {
        let [, tag, operationId] = thing
        setHash(`/${createDeepLinkPath(tag)}/${createDeepLinkPath(operationId)}`)
      }

      if(type === "operations-tag") {
        let [, tag] = thing
        setHash(`/${createDeepLinkPath(tag)}`)
      }
    }

  } catch(e) {
    // This functionality is not mission critical, so if something goes wrong
    // we'll just move on
    console.error(e)
  }
}
