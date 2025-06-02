/**
 * @prettier
 */
import {
  makeIsExpandable,
  getProperties,
} from "./json-schema-2020-12-extensions/fn"
import { wrapOAS31Fn } from "./fn"
import { makeIsFileUploadIntended } from "./oas3-extensions/fn"
import { immutableToJS } from "core/utils"

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
        getJsonSampleSchema: fn.jsonSchema202012.getJsonSampleSchema,
        getYamlSampleSchema: fn.jsonSchema202012.getYamlSampleSchema,
        getXmlSampleSchema: fn.jsonSchema202012.getXmlSampleSchema,
        getSampleSchema: fn.jsonSchema202012.getSampleSchema,
        mergeJsonSchema: fn.jsonSchema202012.mergeJsonSchema,
        getSchemaObjectTypeLabel: (schema) =>
          fn.jsonSchema202012.getType(immutableToJS(schema)),
        getSchemaObjectType: (schema) =>
          fn.jsonSchema202012.foldType(immutableToJS(schema)?.type),
      },
      getSystem()
    )

    Object.assign(this.fn, wrappedFns)
  }

  // overrides behavior in OpenAPI 3.1.x, recognizes more intentions
  const isFileUploadIntended = makeIsFileUploadIntended(getSystem)
  const { isFileUploadIntended: isFileUploadIntendedWrap } = wrapOAS31Fn(
    {
      isFileUploadIntended,
    },
    getSystem()
  )

  this.fn.isFileUploadIntended = isFileUploadIntendedWrap
  this.fn.isFileUploadIntendedOAS31 = isFileUploadIntended

  if (fn.jsonSchema202012) {
    const { hasSchemaType } = wrapOAS31Fn(
      {
        hasSchemaType: fn.jsonSchema202012.hasSchemaType,
      },
      getSystem()
    )

    this.fn.hasSchemaType = hasSchemaType
  }
}

export default afterLoad
