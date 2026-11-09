/**
 * @prettier
 */
import React from "react"

import { useFn } from "../../../hooks"
import type { KeywordProps } from "../../../types"

const SCHEMA_NAME =
  "sui:inline-block sui:ml-[6px] sui:font-[family-name:sans-serif] sui:font-bold sui:text-[12px] sui:leading-[normal] sui:text-json-schema-title sui:dark:text-json-schema-dark-text"

export interface SchemaNameProps extends KeywordProps {
  name?: string | React.ReactElement
}

/**
 * The name of a nested schema next to the property (or items) it belongs to,
 * as json-schema-5 shows `category: Category`. Only the 2.0/3.0 dialects set
 * `fn.getSchemaName`; other instances render nothing.
 */
const SchemaName = ({ schema, name = "" }: SchemaNameProps) => {
  const fn = useFn()
  const schemaName =
    typeof fn.getSchemaName === "function" ? fn.getSchemaName(schema) : ""

  if (!schemaName || !name || schemaName === name) return null

  return (
    <span className={SCHEMA_NAME} data-keyword="schemaName">
      {schemaName}
    </span>
  )
}

export default SchemaName
