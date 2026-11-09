/**
 * @prettier
 */
import React from "react"

import { KEYWORD, KEYWORD_NAME, KEYWORD_VALUE } from "../../../styles"
import type { KeywordProps } from "../../../types"

/** `.json-schema-2020-12-keyword--dependentRequired > ul` and its `li`. */
const DEPENDENT_REQUIRED_LIST = "sui:inline-block sui:p-0 sui:m-0"
const DEPENDENT_REQUIRED_ITEM = "sui:inline sui:list-none"

export interface DependentRequiredProps extends KeywordProps {
  dependentRequired: string[]
}

const DependentRequired = ({ dependentRequired }: DependentRequiredProps) => {
  if (!Array.isArray(dependentRequired) || dependentRequired.length === 0) {
    return null
  }

  return (
    <div className={KEYWORD} data-keyword="dependentRequired">
      <span className={KEYWORD_NAME.primary}>Required when defined</span>
      <ul className={DEPENDENT_REQUIRED_LIST}>
        {dependentRequired.map((propertyName) => (
          <li key={propertyName} className={DEPENDENT_REQUIRED_ITEM}>
            <span className={KEYWORD_VALUE.warning}>{propertyName}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default DependentRequired
