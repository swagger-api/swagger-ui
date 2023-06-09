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

export default typeMap
