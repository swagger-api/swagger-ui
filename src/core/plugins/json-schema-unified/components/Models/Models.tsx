/**
 * @prettier
 */
import React, { useRef, useCallback, useEffect, useMemo } from "react"
import classNames from "classnames"
import { useVirtualizer } from "@tanstack/react-virtual"
import type { VirtualItem } from "@tanstack/react-virtual"
import {
  VIRTUALIZE_MODELS_THRESHOLD,
  VIRTUALIZE_JSON_SCHEMA_2020_12_ESTIMATE_SIZE,
  VIRTUALIZE_MODELS_OVERSCAN,
} from "core/utils/virtualization"

import { useFn } from "../../hooks"
import { getSchemasPath, selectSchemaEntries } from "../../schemas"
import type { SchemasSpecSelectors } from "../../schemas"
import type { OASDialect } from "../../dialects"
import {
  MODELS_SECTION,
  MODELS_HEADING,
  MODELS_CONTROL,
  MODELS_CONTROL_LABEL,
  MODELS_SCROLL,
  MODELS_VIRTUAL_ITEM,
} from "../../styles"
import SchemaItem from "./SchemaItem"
import type { SchemaItemProps } from "./SchemaItem"

type AnyComponent = React.ComponentType<Record<string, unknown>>

export interface ModelsProps {
  dialect: OASDialect
  specSelectors: SchemasSpecSelectors & SchemaItemProps["specSelectors"]
  specActions: SchemaItemProps["specActions"]
  layoutSelectors: {
    isShown: (path: string[], defaultValue?: boolean) => boolean
    getScrollToVirtualizedSchema: () => string | undefined
  }
  layoutActions: SchemaItemProps["layoutActions"] & {
    scrollToElement: (element: Element) => void
    clearScrollToVirtualizedSchema: () => void
  }
  getComponent: (name: string, container?: boolean) => AnyComponent | null
  getConfigs: () => {
    docExpansion?: string
    defaultModelsExpandDepth?: number
  }
}

/**
 * The Schemas section (copy of oas31's `Models` and json-schema-5's
 * virtualized scroll-to-schema): a collapsible section with one
 * `JSONSchemaUnified` per named schema, virtualized from
 * `VIRTUALIZE_MODELS_THRESHOLD` schemas on. Its layout key is the dialect's
 * schemas path (`["components", "schemas"]`), as in oas31's Models.
 */
const Models = ({
  dialect,
  specActions,
  specSelectors,
  layoutSelectors,
  layoutActions,
  getComponent,
  getConfigs,
}: ModelsProps) => {
  const schemasPath = useMemo(() => getSchemasPath(dialect), [dialect])
  const schemaEntries = selectSchemaEntries(specSelectors, dialect)
  const { docExpansion, defaultModelsExpandDepth } = getConfigs()
  const isOpenDefault = defaultModelsExpandDepth > 0 && docExpansion !== "none"
  const isOpen = layoutSelectors.isShown(schemasPath, isOpenDefault)
  const Collapse = getComponent("Collapse")
  const ArrowUpIcon = getComponent("ArrowUpIcon")
  const ArrowDownIcon = getComponent("ArrowDownIcon")
  const { getTitle } = useFn()

  const parentRef = useRef<HTMLDivElement>(null)
  const measurementsCache = useRef<VirtualItem[]>([])

  const virtualizer = useVirtualizer({
    count: schemaEntries.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => VIRTUALIZE_JSON_SCHEMA_2020_12_ESTIMATE_SIZE,
    overscan: VIRTUALIZE_MODELS_OVERSCAN,
    getItemKey: (index) => `models-section-${schemaEntries[index][0]}`,
    initialMeasurementsCache: measurementsCache.current,
    onChange: (instance) => {
      measurementsCache.current = instance.takeSnapshot()
    },
  })

  const isVirtualized = schemaEntries.length >= VIRTUALIZE_MODELS_THRESHOLD
  const pendingVirtualizedSchemaScroll =
    layoutSelectors.getScrollToVirtualizedSchema?.()

  /**
   * Effects.
   */
  useEffect(() => {
    const includesExpandedSchema = schemaEntries.some(([schemaName]) =>
      layoutSelectors.isShown([...schemasPath, schemaName], false)
    )
    const isOpenAndExpanded =
      isOpen && (defaultModelsExpandDepth > 1 || includesExpandedSchema)
    const isResolved = specSelectors.specResolvedSubtree(schemasPath) != null
    if (isOpenAndExpanded && !isResolved) {
      specActions.requestResolvedSubtree(schemasPath)
    }
  }, [isOpen, defaultModelsExpandDepth])

  // deep link to a schema of a virtualized list (json-schema-5's Models)
  useEffect(() => {
    if (!pendingVirtualizedSchemaScroll || !isVirtualized) return

    const index = schemaEntries.findIndex(
      ([schemaName]) => schemaName === pendingVirtualizedSchemaScroll
    )

    if (index !== -1) {
      if (document.querySelector(".operations-virtual")) {
        // scroll instantly to avoid recomputing virtualized operations
        parentRef.current?.scrollIntoView({
          behavior: "instant",
          block: "start",
        })
      } else {
        layoutActions.scrollToElement(parentRef.current)
      }
      virtualizer.scrollToIndex(index, { align: "start" })
    }

    layoutActions.clearScrollToVirtualizedSchema()
  }, [
    pendingVirtualizedSchemaScroll,
    schemaEntries,
    virtualizer,
    isVirtualized,
    layoutActions,
  ])

  /**
   * Event handlers.
   */
  const handleModelsExpand = useCallback(() => {
    layoutActions.show(schemasPath, !isOpen)
  }, [isOpen, layoutActions, schemasPath])
  const handleModelsRef = useCallback(
    (node: HTMLElement | null) => {
      if (node !== null) {
        layoutActions.readyToScroll(schemasPath, node)
      }
    },
    [layoutActions, schemasPath]
  )

  /**
   * Rendering.
   */
  if (!schemaEntries.length || defaultModelsExpandDepth < 0) {
    return null
  }

  const renderSchemaItem = (schemaName: string, schema: unknown) => {
    const name =
      getTitle(schema as Parameters<typeof getTitle>[0], {
        lookup: "basic",
      }) || schemaName

    return (
      <SchemaItem
        key={schemaName}
        schemaName={schemaName}
        schema={schema as SchemaItemProps["schema"]}
        name={name}
        schemasPath={schemasPath}
        specSelectors={specSelectors}
        specActions={specActions}
        layoutActions={layoutActions}
        getComponent={getComponent}
      />
    )
  }

  return (
    <section
      data-json-schema-unified-models=""
      data-expanded={isOpen ? "true" : "false"}
      className={classNames(
        MODELS_SECTION.base,
        isOpen
          ? isVirtualized
            ? MODELS_SECTION.openVirtualized
            : MODELS_SECTION.open
          : MODELS_SECTION.closed
      )}
      ref={handleModelsRef}
    >
      <h4
        className={classNames(
          MODELS_HEADING.base,
          isOpen ? MODELS_HEADING.open : MODELS_HEADING.closed
        )}
      >
        <button
          type="button"
          aria-expanded={isOpen}
          className={classNames(
            MODELS_CONTROL.base,
            isOpen ? MODELS_CONTROL.open : MODELS_CONTROL.closed
          )}
          onClick={handleModelsExpand}
        >
          <span className={MODELS_CONTROL_LABEL}>Schemas</span>
          {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </button>
      </h4>
      <Collapse isOpened={isOpen}>
        {isVirtualized ? (
          <div
            ref={parentRef}
            className={MODELS_SCROLL}
            data-json-schema-unified-models-scroll=""
          >
            <div
              style={{
                paddingTop: virtualizer.getVirtualItems()[0]?.start ?? 0,
                paddingBottom:
                  virtualizer.getTotalSize() -
                  (virtualizer.getVirtualItems().at(-1)?.end ?? 0),
              }}
            >
              {virtualizer.getVirtualItems().map((vItem) => {
                const [schemaName, schema] = schemaEntries[vItem.index]

                return (
                  <div
                    key={vItem.key}
                    data-index={vItem.index}
                    ref={virtualizer.measureElement}
                    className={MODELS_VIRTUAL_ITEM}
                  >
                    {renderSchemaItem(schemaName, schema)}
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          schemaEntries.map(([schemaName, schema]) =>
            renderSchemaItem(schemaName, schema)
          )
        )}
      </Collapse>
    </section>
  )
}

export default Models
