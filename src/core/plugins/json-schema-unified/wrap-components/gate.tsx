/**
 * @prettier
 */
import React from "react"

import { getEnabledUnifiedDialect } from "../versions"
import type { GateSystem } from "../versions"
import { getUnifiedView } from "../views"
import type { UnifiedViewName, ViewOptions, ViewSystem } from "../views"
import type { OASDialect } from "../dialects"

type AnyComponent = React.ComponentType<Record<string, unknown>>
type Props = Record<string, unknown>

export interface WrapperSystem
  extends Omit<ViewSystem, "getSystem">,
    Omit<GateSystem, "getConfigs"> {
  getSystem: () => WrapperSystem
  getConfigs: () => Record<string, unknown>
}

/**
 * Builds a `wrapComponents` factory for `view`. At render time the wrapper
 * reads the option and the document version from the current system and
 * renders either the original component unchanged or the cached unified view
 * for the options `getOptions` derives from the props and configs.
 */
export const makeUnifiedViewWrapper =
  (
    view: UnifiedViewName,
    getOptions: (
      props: Props,
      configs: Record<string, unknown>
    ) => Omit<ViewOptions, "dialect">
  ) =>
  (Original: AnyComponent, system: WrapperSystem) => {
    const UnifiedViewGate = (props: Props) => {
      const currentSystem = system.getSystem()
      const dialect: OASDialect | null = getEnabledUnifiedDialect(currentSystem)

      if (!dialect) return <Original {...props} />

      const View = getUnifiedView(currentSystem, view, {
        dialect,
        ...getOptions(props, currentSystem.getConfigs()),
      })

      return <View {...props} dialect={dialect} />
    }
    UnifiedViewGate.displayName = `JSONSchemaUnified${view}Gate`

    return UnifiedViewGate
  }
