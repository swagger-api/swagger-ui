/**
 * @prettier
 */
import React from "react"

import { useComponent } from "../../../hooks"
import type { KeywordProps } from "../../../types"

/**
 * A component for a 2020-12 slot of `JSONSchema` (e.g. `KeywordDescription`)
 * that renders the instance's component registered under another context
 * name (e.g. `KeywordOASDescription`).
 *
 * The OAS dialects put these into `overrides.components` instead of the OAS
 * components themselves, so that in a system HOC instance the slot renders
 * the system's (possibly wrapped) `JSONSchemaUnifiedKeywordOAS*` component.
 */
const makeSlot = (contextName: string) => {
  const Slot = (props: KeywordProps) => {
    const Component = useComponent(contextName)

    return Component ? <Component {...props} /> : null
  }
  Slot.displayName = `JSONSchemaUnifiedSlot(${contextName})`

  return Slot
}

export const DescriptionSlot = makeSlot("KeywordOASDescription")

export const ExamplesSlot = makeSlot("KeywordOASExamples")

export const PropertiesSlot = makeSlot("KeywordOASProperties")
