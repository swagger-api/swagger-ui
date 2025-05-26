/**
 * @prettier
 */
import {
  sampleFromSchema,
  inferSchema,
  sampleFromSchemaGeneric,
  createXMLExample,
  memoizedCreateXMLExample,
  memoizedSampleFromSchema,
  mergeJsonSchema,
  getSchemaObjectType,
} from "./fn/index"
import makeGetJsonSampleSchema from "./fn/get-json-sample-schema"
import makeGetYamlSampleSchema from "./fn/get-yaml-sample-schema"
import makeGetXmlSampleSchema from "./fn/get-xml-sample-schema"
import makeGetSampleSchema from "./fn/get-sample-schema"

const JSONSchema5SamplesPlugin = ({ getSystem }) => {
  const getJsonSampleSchema = makeGetJsonSampleSchema(getSystem)
  const getYamlSampleSchema = makeGetYamlSampleSchema(getSystem)
  const getXmlSampleSchema = makeGetXmlSampleSchema(getSystem)
  const getSampleSchema = makeGetSampleSchema(getSystem)

  return {
    fn: {
      jsonSchema5: {
        inferSchema,
        sampleFromSchema,
        sampleFromSchemaGeneric,
        createXMLExample,
        memoizedSampleFromSchema,
        memoizedCreateXMLExample,
        getJsonSampleSchema,
        getYamlSampleSchema,
        getXmlSampleSchema,
        getSampleSchema,
        mergeJsonSchema,
      },
      inferSchema,
      sampleFromSchema,
      sampleFromSchemaGeneric,
      createXMLExample,
      memoizedSampleFromSchema,
      memoizedCreateXMLExample,
      getJsonSampleSchema,
      getYamlSampleSchema,
      getXmlSampleSchema,
      getSampleSchema,
      mergeJsonSchema,
      getSchemaObjectType,
    },
  }
}

export default JSONSchema5SamplesPlugin
