/**
 * @prettier
 */
import { List, Map, OrderedMap } from "immutable"

type TagObj = Map<string, unknown>
type TaggedOps = OrderedMap<unknown, TagObj>

export default function (taggedOps: TaggedOps, phrase?: string): TaggedOps {
  if (!phrase) {
    return taggedOps
  }

  const normalizedPhrase = phrase.toLowerCase()

  return taggedOps
    .map((tagObj, tag) => {
      if (String(tag).toLowerCase().includes(normalizedPhrase)) {
        return tagObj
      }

      const operations = Map.isMap(tagObj)
        ? tagObj.get("operations")
        : undefined

      if (!List.isList(operations)) {
        return null
      }

      const matchingOperations = operations.filter(
        (op) =>
          Map.isMap(op) &&
          String(op.get("path")).toLowerCase().includes(normalizedPhrase)
      )

      return matchingOperations.size > 0
        ? tagObj.set("operations", matchingOperations)
        : null
    })
    .filter((tagObj): tagObj is TagObj => tagObj !== null)
}
