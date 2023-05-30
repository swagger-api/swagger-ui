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
} from "./fn/index"
import makeGetJsonSampleSchema from "./fn/get-json-sample-schema"
import makeGetYamlSampleSchema from "./fn/get-yaml-sample-schema"
import makeGetXmlSampleSchema from "./fn/get-xml-sample-schema"
import makeGetSampleSchema from "./fn/get-sample-schema"

const SamplesPlugin = ({ getSystem }) => ({
  fn: {
    inferSchema,
    sampleFromSchema,
    sampleFromSchemaGeneric,
    createXMLExample,
    memoizedSampleFromSchema,
    memoizedCreateXMLExample,
    getJsonSampleSchema: makeGetJsonSampleSchema(getSystem),
    getYamlSampleSchema: makeGetYamlSampleSchema(getSystem),
    getXmlSampleSchema: makeGetXmlSampleSchema(getSystem),
    getSampleSchema: makeGetSampleSchema(getSystem),
  },
})

export default SamplesPlugin
