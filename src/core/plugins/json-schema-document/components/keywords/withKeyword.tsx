/**
 * @prettier
 */
import React from "react"

import type { KeywordProps, Schema, System } from "./types"

type Component = React.ComponentType<Record<string, unknown>>

/**
 * A keyword component of the json-schema-2020-12 renderer followed by a
 * keyword component of the dialect: the renderer places every keyword itself
 * (`JSONSchema.jsx`), so a keyword it doesn't know renders next to the one it
 * belongs with, by overriding that one in the dialect's renderer instance.
 */
const withKeyword = (
  Original: Component,
  Keyword: React.ComponentType<KeywordProps>,
  getSystem: () => System
) => {
  const WithKeyword = (props: { schema: Schema; [prop: string]: unknown }) => (
    <>
      <Original {...props} />
      <Keyword schema={props.schema} getSystem={getSystem} />
    </>
  )

  return WithKeyword
}

export default withKeyword
