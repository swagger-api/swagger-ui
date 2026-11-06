/**
 * @prettier
 */
import React from "react"

import { schema } from "../../../prop-types"
import { toPlainObject, toSchemaObject } from "../../../fn"
import { ATTRIBUTE, PROPERTY } from "../../../styles"
import OASObject, { OASField } from "./OASObject"
import type { KeywordProps, OASXml } from "../../../types"

/**
 * OpenAPI `xml`: `attribute`/`wrapped` as muted attributes, `name`,
 * `namespace` and `prefix` as children.
 */
const Xml = ({ schema }: KeywordProps) => {
  const xml = toPlainObject<OASXml>(toSchemaObject(schema).xml)

  return (
    <OASObject
      keyword="xml"
      label="XML"
      value={xml}
      hasFields={Boolean(xml.name || xml.namespace || xml.prefix)}
      attributes={
        <>
          {xml.attribute === true && (
            <span className={ATTRIBUTE.muted}>attribute</span>
          )}
          {xml.wrapped === true && (
            <span className={ATTRIBUTE.muted}>wrapped</span>
          )}
        </>
      }
    >
      {xml.name && (
        <li className={PROPERTY}>
          <OASField name="name" value={xml.name} />
        </li>
      )}
      {xml.namespace && (
        <li className={PROPERTY}>
          <OASField name="namespace" value={xml.namespace} />
        </li>
      )}
      {xml.prefix && (
        <li className={PROPERTY}>
          <OASField name="prefix" value={xml.prefix} />
        </li>
      )}
    </OASObject>
  )
}

Xml.propTypes = {
  schema: schema.isRequired,
}

export default Xml
