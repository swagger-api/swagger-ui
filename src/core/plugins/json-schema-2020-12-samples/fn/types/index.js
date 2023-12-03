/**
 * @prettier
 */
import arrayType from "./array"
import objectType from "./object"
import stringType from "./string"
import numberType from "./number"
import integerType from "./integer"
import booleanType from "./boolean"
import nullType from "./null"

const typeMap = {
  array: arrayType,
  object: objectType,
  string: stringType,
  number: numberType,
  integer: integerType,
  boolean: booleanType,
  null: nullType,
}

export default new Proxy(typeMap, {
  get(target, prop) {
    if (typeof prop === "string" && Object.hasOwn(target, prop)) {
      return target[prop]
    }

    return () => `Unknown Type: ${prop}`
  },
})
