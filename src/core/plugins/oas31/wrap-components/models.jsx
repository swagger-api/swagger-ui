/**
 * @prettier
 */
import React from "react"

import { createOnlyOAS31ComponentWrapper } from "../fn"

const ModelsWrapper = createOnlyOAS31ComponentWrapper(({ getSystem }) => {
  const { getComponent, fn } = getSystem()
  const Models = getComponent("OAS31Models", true)
  const JSONSchema = getComponent("JSONSchema202012")
  const BooleanJSONSchema = getComponent("BooleanJSONSchema202012")
  const Accordion = getComponent("JSONSchema202012Accordion")
  const ChevronRightIcon = getComponent("JSONSchema202012ChevronRightIcon")
  const withSchemaContext = getComponent("withJSONSchema202012Context")
  const ModelsWithJSONContext = withSchemaContext(Models, {
    config: {
      default$schema: "https://spec.openapis.org/oas/3.1/dialect/base",
    },
    components: {
      JSONSchema,
      BooleanJSONSchema,
      Accordion,
      ChevronRightIcon,
    },
    fn: {
      upperFirst: fn.upperFirst,
    },
  })

  return <ModelsWithJSONContext />
})

export default ModelsWrapper
