/**
 * @prettier
 */
import type { OASDialect } from "./dialects"

/**
 * The spec selectors the version detection reads. Every detector is
 * optional: a selector a preset does not register means "not this version".
 */
export interface VersionSpecSelectors {
  isSwagger2?: () => boolean
  isOAS30?: () => boolean
  isOAS31?: () => boolean
  isOAS32?: () => boolean
  [selector: string]: unknown
}

export interface UnifiedDialectEntry {
  dialect: OASDialect
  /** True when the current document is of this entry's version. */
  isActive: (specSelectors: VersionSpecSelectors) => boolean
}

/**
 * Document version -> unified dialect, checked in order (newest first). A
 * document whose version has no entry (an undetected version) falls through
 * to the original Model/Models view. Supporting a new version is one entry
 * here (plus its dialect in `./dialects`). 3.0 is detected with oas3's
 * `isOAS30` (its `isOAS3` is widened to 3.1/3.2 by those plugins).
 */
export const UNIFIED_DIALECTS: ReadonlyArray<UnifiedDialectEntry> =
  Object.freeze([
    {
      dialect: "oas32",
      isActive: (specSelectors) => specSelectors.isOAS32?.() === true,
    },
    {
      dialect: "oas31",
      isActive: (specSelectors) => specSelectors.isOAS31?.() === true,
    },
    {
      dialect: "oas30",
      isActive: (specSelectors) => specSelectors.isOAS30?.() === true,
    },
    {
      dialect: "swagger2",
      isActive: (specSelectors) => specSelectors.isSwagger2?.() === true,
    },
  ])

/**
 * The unified dialect of the current document, or `null` when the document's
 * version has none.
 */
export const getUnifiedDialect = (
  specSelectors: VersionSpecSelectors | undefined
): OASDialect | null => {
  if (!specSelectors) return null
  const entry = UNIFIED_DIALECTS.find(({ isActive }) => isActive(specSelectors))
  return entry ? entry.dialect : null
}

export interface GateSystem {
  getConfigs: () => { unifiedJSONSchemaEnabled?: unknown }
  specSelectors: VersionSpecSelectors
}

/**
 * The render-time gate of the Model/Models wrappers: the dialect to render
 * with, or `null` (render the original view) when `unifiedJSONSchemaEnabled`
 * is not `true` or the document's version has no unified dialect.
 */
export const getEnabledUnifiedDialect = (
  system: GateSystem
): OASDialect | null => {
  if (system.getConfigs().unifiedJSONSchemaEnabled !== true) return null
  return getUnifiedDialect(system.specSelectors)
}
