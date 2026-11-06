/**
 * @prettier
 */
import React from "react"

import { schema } from "../../../../prop-types"
import { toPlainObject, toSchemaObject } from "../../../../fn"
import { ATTRIBUTE, PROPERTY } from "../../../../styles"
import OASObject from "../OASObject"
import DiscriminatorMapping from "./DiscriminatorMapping"
import type { KeywordProps, OASDiscriminator } from "../../../../types"

/**
 * OpenAPI `discriminator`: `propertyName` as a muted attribute, `mapping`
 * entries as children.
 */
const Discriminator = ({ schema }: KeywordProps) => {
  const discriminator = toPlainObject<OASDiscriminator>(
    toSchemaObject(schema).discriminator
  )

  return (
    <OASObject
      keyword="discriminator"
      label="Discriminator"
      value={discriminator}
      hasFields={Boolean(discriminator.mapping)}
      attributes={
        discriminator.propertyName ? (
          <span className={ATTRIBUTE.muted}>{discriminator.propertyName}</span>
        ) : null
      }
    >
      <li className={PROPERTY}>
        <DiscriminatorMapping discriminator={discriminator} />
      </li>
    </OASObject>
  )
}

Discriminator.propTypes = {
  schema: schema.isRequired,
}

export default Discriminator
