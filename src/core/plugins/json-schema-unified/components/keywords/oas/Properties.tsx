/**
 * @prettier
 */
import React from "react"

import { schema } from "../../../prop-types"
import { useConfig, useFn } from "../../../hooks"
import { toSchemaObject } from "../../../fn"
import { PropertiesList } from "../Properties/Properties"
import type { KeywordProps } from "../../../types"

/**
 * The OAS dialects' `properties`: the properties `fn.getProperties` returns
 * for the instance config (`includeReadOnly`, `includeWriteOnly`). Without a
 * `getProperties` in the instance, every property is shown.
 */
const OASProperties = ({ schema }: KeywordProps) => {
  const fn = useFn()
  const config = useConfig()
  const properties = fn.getProperties
    ? fn.getProperties(schema, config)
    : toSchemaObject(schema).properties || {}

  return <PropertiesList schema={schema} properties={properties} />
}

OASProperties.propTypes = {
  schema: schema.isRequired,
}

export default OASProperties
