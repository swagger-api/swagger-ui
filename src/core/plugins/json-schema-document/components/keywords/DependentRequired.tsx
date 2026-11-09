/**
 * @prettier
 */
import React from "react"

import { getBlankNameLabel, isBlank } from "../../fn"

export interface DependentRequiredProps {
  dependentRequired: string[]
}

/**
 * The properties whose presence makes a property required, listed as the
 * json-schema-2020-12 renderer's `DependentRequired` component lists them
 * (a copy; keep the two in step), except for a name that is empty or only
 * whitespace: it is shown as an emphasised label, so it isn't taken for a
 * property of that name, and every name is listed on its own.
 */
const DependentRequired = ({ dependentRequired }: DependentRequiredProps) => {
  if (!Array.isArray(dependentRequired) || dependentRequired.length === 0) {
    return null
  }

  return (
    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--dependentRequired">
      <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--primary">
        Required when defined
      </span>
      <ul>
        {dependentRequired.map((propertyName) => (
          <li key={propertyName}>
            <span className="json-schema-2020-12-keyword__value json-schema-2020-12-keyword__value--warning">
              {isBlank(propertyName) ? (
                <em>{getBlankNameLabel(propertyName)}</em>
              ) : (
                propertyName
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default DependentRequired
