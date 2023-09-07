/**
 * @prettier
 */
import { Map } from "immutable"
import { createOnlyOAS31SelectorWrapper } from "../fn"

export const definitionsToAuthorize = createOnlyOAS31SelectorWrapper(
  () => (oriSelector, system) => {
    const definitions = system.specSelectors.securityDefinitions()
    let list = oriSelector()

    if (!definitions) return list

    definitions.entrySeq().forEach(([defName, definition]) => {
      const type = definition.get("type")

      if (type === "mutualTLS") {
        list = list.push(
          new Map({
            [defName]: definition,
          })
        )
      }
    })

    return list
  }
)
