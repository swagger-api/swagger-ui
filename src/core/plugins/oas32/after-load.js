/**
 * @prettier
 */
import { makeIsFileUploadIntended } from "./oas3-extensions/fn"
import { wrapOAS32Fn } from "./fn"
import { immutableToJS } from "core/utils"

function afterLoad({ fn, getSystem }) {
  // Wire up JSON Schema 2020-12 sample generation functions for OAS 3.2.
  // OAS 3.2 uses the same JSON Schema 2020-12 dialect as OAS 3.1, so we point
  // the system-level sample functions at the jsonSchema202012 implementations
  // when the loaded spec is OAS 3.2.
  if (typeof fn.sampleFromSchema === "function" && fn.jsonSchema202012) {
    const wrappedFns = wrapOAS32Fn(
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

  // Wrap file-upload detection for OAS 3.2 (supports contentMediaType / contentEncoding).
  const isFileUploadIntended = makeIsFileUploadIntended(getSystem)
  const { isFileUploadIntended: isFileUploadIntendedWrap } = wrapOAS32Fn(
    { isFileUploadIntended },
    getSystem()
  )

  this.fn.isFileUploadIntended = isFileUploadIntendedWrap
  this.fn.isFileUploadIntendedOAS32 = isFileUploadIntended

  // Wrap hasSchemaType for OAS 3.2.
  if (fn.jsonSchema202012) {
    const { hasSchemaType } = wrapOAS32Fn(
      { hasSchemaType: fn.jsonSchema202012.hasSchemaType },
      getSystem()
    )

    this.fn.hasSchemaType = hasSchemaType
  }
}

export default afterLoad
