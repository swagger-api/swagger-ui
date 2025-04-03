/**
 * @prettier
 */
import ModelCollapse from "./components/model-collapse"
import ModelExample from "./components/model-example"
import ModelWrapper from "./components/model-wrapper"
import Model from "./components/model"
import Models from "./components/models"
import EnumModel from "./components/enum-model"
import ObjectModel from "./components/object-model"
import ArrayModel from "./components/array-model"
import PrimitiveModel from "./components/primitive-model"
import Schemes from "./components/schemes"
import SchemesContainer from "./containers/schemes"
import * as JSONSchemaComponents from "./components/json-schema-components"
import { ModelExtensions } from "./components/model-extensions"

const JSONSchema5Plugin = () => ({
  components: {
    modelExample: ModelExample,
    ModelWrapper,
    ModelCollapse,
    Model,
    Models,
    EnumModel,
    ObjectModel,
    ArrayModel,
    PrimitiveModel,
    ModelExtensions,
    schemes: Schemes,
    SchemesContainer,
    ...JSONSchemaComponents,
  },
})

export default JSONSchema5Plugin
