/**
 * @prettier
 */
import type React from "react"

import { getOASDialectOverrides } from "./dialects"
import type { OASDialect, OASDialectOptions } from "./dialects"
import type { JSONSchemaOverrides } from "./types"

type AnyComponent = React.ComponentType<Record<string, unknown>>

export type UnifiedViewName = "Model" | "Models"

/** The registered view component each unified view renders. */
export const VIEW_COMPONENTS: Readonly<Record<UnifiedViewName, string>> =
  Object.freeze({
    Model: "JSONSchemaUnifiedModel",
    Models: "JSONSchemaUnifiedModels",
  })

export interface ViewOptions extends OASDialectOptions {
  dialect: OASDialect
}

export interface ViewSystem {
  getSystem: () => unknown
  getComponent: (name: string, container?: boolean) => AnyComponent | null
  fn: {
    withErrorBoundary?: (Component: AnyComponent) => AnyComponent
  }
}

/**
 * Unified views per System (keyed by its stable `getSystem` function), then
 * per view and render inputs. A view is built once per combination and reused
 * on every render, because building the HOC is expensive. It is never cached
 * per page or on a static field: a request and a response Schema tab of the
 * same document get different instances.
 */
const viewCache = new WeakMap<object, Map<string, AnyComponent>>()

export const getViewCacheKey = (
  view: UnifiedViewName,
  {
    dialect,
    includeReadOnly,
    includeWriteOnly,
    defaultExpandedLevels,
    showExtensions,
  }: ViewOptions
): string =>
  JSON.stringify([
    view,
    dialect,
    Boolean(includeReadOnly),
    Boolean(includeWriteOnly),
    typeof defaultExpandedLevels === "number" ? defaultExpandedLevels : null,
    typeof showExtensions === "boolean" ? showExtensions : null,
  ])

/**
 * Returns the unified `view` for the options: the registered view component
 * (the `Models` one as a container) inside a `JSONSchemaUnified` instance
 * configured for the dialect, inside the system's error boundary
 * (`fn.withErrorBoundary`, from safe-render) so a crash only replaces this
 * view with the fallback.
 */
export const getUnifiedView = (
  system: ViewSystem,
  view: UnifiedViewName,
  options: ViewOptions
): AnyComponent => {
  let views = viewCache.get(system.getSystem)
  if (!views) {
    views = new Map()
    viewCache.set(system.getSystem, views)
  }

  const key = getViewCacheKey(view, options)
  const cached = views.get(key)
  if (cached) return cached

  const { getComponent, fn } = system
  const Component = getComponent(VIEW_COMPONENTS[view], view === "Models")
  const withSystemContext = getComponent(
    "withJSONSchemaUnifiedSystemContext"
  ) as unknown as (
    Component: AnyComponent,
    overrides: JSONSchemaOverrides
  ) => AnyComponent
  const { dialect, ...dialectOptions } = options
  const WithContext = withSystemContext(
    Component,
    getOASDialectOverrides(dialect, dialectOptions)
  )
  WithContext.displayName = `JSONSchemaUnified${view}View`
  const View =
    typeof fn.withErrorBoundary === "function"
      ? fn.withErrorBoundary(WithContext)
      : WithContext

  views.set(key, View)
  return View
}
