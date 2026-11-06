/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

import { stringify, toPlainObject } from "../../../../fn"
import { OASField } from "../OASObject"
import type { OASDiscriminator } from "../../../../types"

export interface DiscriminatorMappingProps {
  discriminator: OASDiscriminator
}

const DiscriminatorMapping = ({ discriminator }: DiscriminatorMappingProps) => {
  const mapping = toPlainObject(discriminator?.mapping)

  if (Object.keys(mapping).length === 0) {
    return null
  }

  return (
    <>
      {Object.entries(mapping).map(([key, value]) => (
        <React.Fragment key={`${key}-${String(value)}`}>
          <OASField
            name={key}
            value={typeof value === "string" ? value : stringify(value)}
          />
        </React.Fragment>
      ))}
    </>
  )
}

DiscriminatorMapping.propTypes = {
  discriminator: PropTypes.shape({
    mapping: PropTypes.any,
  }),
}

export default DiscriminatorMapping
