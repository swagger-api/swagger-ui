/**
 * @prettier
 */
import {
  makeIsExpandable,
  getProperties,
} from "./json-schema-2020-12-extensions/fn"
import { wrapOAS31Fn } from "./fn"

function afterLoad({ fn, getSystem }) {
  // overrides for fn.jsonSchema202012
  if (fn.jsonSchema202012) {
    const isExpandable = makeIsExpandable(
      fn.jsonSchema202012.isExpandable,
      getSystem
    )

    Object.assign(this.fn.jsonSchema202012, { isExpandable, getProperties })
  }

  // wraps schema generators from samples plugin and make them specific to OpenAPI 3.1 version
  if (typeof fn.sampleFromSchema === "function" && fn.jsonSchema202012) {
    const wrappedFns = wrapOAS31Fn(
      {
        sampleFromSchema: fn.jsonSchema202012.sampleFromSchema,
        sampleFromSchemaGeneric: fn.jsonSchema202012.sampleFromSchemaGeneric,
        createXMLExample: fn.jsonSchema202012.createXMLExample,
        memoizedSampleFromSchema: fn.jsonSchema202012.memoizedSampleFromSchema,
        memoizedCreateXMLExample: fn.jsonSchema202012.memoizedCreateXMLExample,
      },
      getSystem()
    )

    Object.assign(this.fn, wrappedFns)
  }
}

export default afterLoad
