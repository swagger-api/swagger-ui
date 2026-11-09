/**
 * @prettier
 */
import React from "react"

import { isPlainObject } from "../../../fn"
import type { Constraint as ConstraintValue } from "../../../types"

/**
 * `.json-schema-2020-12__constraint` (code text on a purple chip) and its
 * `--string` modifier (amber chip), keyed by `constraint.scope`. In dark mode
 * the text is near-black and the chips use the dark palette.
 */
const CONSTRAINT: Record<ConstraintValue["scope"], string> = {
  number:
    "sui:font-[family-name:monospace] sui:font-semibold sui:ml-[10px] sui:leading-[1.5] sui:py-px sui:px-[3px] sui:rounded-[4px] sui:text-json-schema-constraint-text sui:dark:text-json-schema-dark-constraint-text sui:bg-json-schema-constraint sui:dark:bg-json-schema-dark-prop-type",
  string:
    "sui:font-[family-name:monospace] sui:font-semibold sui:ml-[10px] sui:leading-[1.5] sui:py-px sui:px-[3px] sui:rounded-[4px] sui:text-json-schema-constraint-text sui:dark:text-json-schema-dark-constraint-text sui:bg-json-schema-constraint-string sui:dark:bg-json-schema-dark-constraint-string",
  array:
    "sui:font-[family-name:monospace] sui:font-semibold sui:ml-[10px] sui:leading-[1.5] sui:py-px sui:px-[3px] sui:rounded-[4px] sui:text-json-schema-constraint-text sui:dark:text-json-schema-dark-constraint-text sui:bg-json-schema-constraint sui:dark:bg-json-schema-dark-prop-type",
  object:
    "sui:font-[family-name:monospace] sui:font-semibold sui:ml-[10px] sui:leading-[1.5] sui:py-px sui:px-[3px] sui:rounded-[4px] sui:text-json-schema-constraint-text sui:dark:text-json-schema-dark-constraint-text sui:bg-json-schema-constraint sui:dark:bg-json-schema-dark-prop-type",
}

export interface ConstraintProps {
  constraint: ConstraintValue
}

/**
 * This component represents various constraint keywords
 * from JSON Schema 2020-12 validation vocabulary.
 */
const Constraint = ({ constraint }: ConstraintProps) => {
  if (
    !isPlainObject(constraint) ||
    typeof constraint.scope !== "string" ||
    typeof constraint.value !== "string"
  ) {
    return null
  }

  return (
    <span
      className={CONSTRAINT[constraint.scope] ?? CONSTRAINT.number}
      data-keyword="constraint"
      data-constraint-scope={constraint.scope}
    >
      {constraint.value}
    </span>
  )
}

export default React.memo(Constraint)
