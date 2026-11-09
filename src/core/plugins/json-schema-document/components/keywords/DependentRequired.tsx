/**
 * @prettier
 */
import React from "react"

import { getDependentRequiredLabels } from "../../fn"

type Component = React.ComponentType<Record<string, unknown>>

/**
 * The "Required when defined" component the system has registered for the
 * json-schema-2020-12 renderer (a plugin may have wrapped or replaced it),
 * given a label for a property name that is empty or only whitespace instead
 * of the name: the registered component would list it as an empty item.
 */
const withBlankNames = (Original: Component) => {
  const WithBlankNames = ({
    dependentRequired,
    ...props
  }: {
    dependentRequired?: unknown
    [prop: string]: unknown
  }) => (
    <Original
      {...props}
      dependentRequired={
        Array.isArray(dependentRequired)
          ? getDependentRequiredLabels(dependentRequired as string[])
          : dependentRequired
      }
    />
  )

  return WithBlankNames
}

export default withBlankNames
