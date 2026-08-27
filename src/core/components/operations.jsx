/**
 * @prettier
 */
import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
} from "react"
import PropTypes from "prop-types"
import { useWindowVirtualizer, useVirtualizer } from "@tanstack/react-virtual"
import { opId } from "swagger-client/es/helpers"
import {
  VIRTUALIZE_OPERATIONS_THRESHOLD,
  VIRTUALIZE_OPERATIONS_TAG_ESTIMATE_SIZE,
  VIRTUALIZE_OPERATIONS_ESTIMATE_SIZE,
  VIRTUALIZE_OPERATIONS_OVERSCAN,
} from "core/utils/virtualization"

const findScrollParent = (el) => {
  let node = el.parentElement

  while (node && node !== document.documentElement) {
    const { overflow, overflowY } = getComputedStyle(node)

    if (/(auto|scroll)/.test(overflow + overflowY)) return node

    node = node.parentElement
  }

  return document.documentElement
}

const Operations = ({
  specSelectors,
  getComponent,
  oas3Selectors,
  layoutSelectors,
  layoutActions,
  getConfigs,
}) => {
  const taggedOps = specSelectors.taggedOperations()
  const validOperationMethods = specSelectors.validOperationMethods()
  const { docExpansion } = getConfigs()

  const tagDefaultOpen = docExpansion === "full" || docExpansion === "list"

  // Derive a key for flatItems useMemo that changes when any tag is expanded/collapsed
  const expandedTagsState = taggedOps
    .keySeq()
    .map((tag) =>
      layoutSelectors.isShown(["operations-tag", tag], tagDefaultOpen)
    )
    .join(",")

  const flatItems = useMemo(() => {
    const items = []

    taggedOps.entrySeq().forEach(([tag, tagObj]) => {
      items.push({ type: "tag", tag, tagObj })

      const tagOpen = layoutSelectors.isShown(
        ["operations-tag", tag],
        tagDefaultOpen
      )

      if (!tagOpen) return

      tagObj.get("operations").forEach((op) => {
        const method = op.get("method")

        if (validOperationMethods.indexOf(method) === -1) return

        const path = op.get("path")
        const operationId =
          op.getIn(["operation", "__originalOperationId"]) ||
          op.getIn(["operation", "operationId"]) ||
          opId(op.get("operation"), path, method) ||
          op.get("id")

        items.push({
          type: "operation",
          tag,
          op,
          method,
          path,
          specPath: op.get("specPath"),
          operationId,
        })
      })
    })

    return items
  }, [taggedOps, validOperationMethods, tagDefaultOpen, expandedTagsState])

  const isVirtualized = flatItems.length >= VIRTUALIZE_OPERATIONS_THRESHOLD

  const [containerEl, setContainerEl] = useState(null)
  const [scrollMargin, setScrollMargin] = useState(0)
  const listRef = useRef(null)

  useLayoutEffect(() => {
    const el = listRef.current

    if (!el) return

    const container = findScrollParent(el)
    const isWindowScroll = container === document.documentElement

    if (!isWindowScroll) {
      setContainerEl(container)
    }

    const measure = () => {
      if (isWindowScroll) {
        setScrollMargin(el.offsetTop)
      } else {
        const listRect = el.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        setScrollMargin(listRect.top - containerRect.top + container.scrollTop)
      }
    }

    measure()
    window.addEventListener("resize", measure)

    return () => window.removeEventListener("resize", measure)
  }, [])

  const isWindowScroll = containerEl === null

  const windowVirtualizer = useWindowVirtualizer({
    enabled: isWindowScroll,
    count: isWindowScroll && isVirtualized ? flatItems.length : 0,
    estimateSize: (i) =>
      flatItems[i]?.type === "tag"
        ? VIRTUALIZE_OPERATIONS_TAG_ESTIMATE_SIZE
        : VIRTUALIZE_OPERATIONS_ESTIMATE_SIZE,
    overscan: VIRTUALIZE_OPERATIONS_OVERSCAN,
    scrollMargin,
    getItemKey: (index) => {
      const item = flatItems[index]
      return item.type === "tag"
        ? `tag-${item.tag}`
        : `op-${item.tag}-${item.path}-${item.method}`
    },
  })

  const containerVirtualizer = useVirtualizer({
    enabled: !isWindowScroll,
    count: !isWindowScroll && isVirtualized ? flatItems.length : 0,
    estimateSize: (i) =>
      flatItems[i]?.type === "tag"
        ? VIRTUALIZE_OPERATIONS_TAG_ESTIMATE_SIZE
        : VIRTUALIZE_OPERATIONS_ESTIMATE_SIZE,
    overscan: VIRTUALIZE_OPERATIONS_OVERSCAN,
    getScrollElement: () => containerEl,
    scrollMargin,
    getItemKey: (index) => {
      const item = flatItems[index]
      return item.type === "tag"
        ? `tag-${item.tag}`
        : `op-${item.tag}-${item.path}-${item.method}`
    },
  })

  const virtualizer = isWindowScroll ? windowVirtualizer : containerVirtualizer

  const pendingVirtualizedOperationScroll =
    layoutSelectors.getScrollToVirtualizedOperation()

  useEffect(() => {
    if (!pendingVirtualizedOperationScroll || !isVirtualized) return

    const [type, tag, operationId] = pendingVirtualizedOperationScroll

    let idx = -1

    if (type === "operations") {
      idx = flatItems.findIndex(
        (item) =>
          item.type === "operation" &&
          item.tag === tag &&
          item.operationId === operationId
      )
    } else if (type === "operations-tag") {
      idx = flatItems.findIndex(
        (item) => item.type === "tag" && item.tag === tag
      )
    }

    if (idx !== -1) {
      virtualizer.scrollToIndex(idx, { align: "start" })
    }

    layoutActions.clearScrollToVirtualizedOperation()
    layoutActions.clearScrollTo()
  }, [
    pendingVirtualizedOperationScroll,
    flatItems,
    virtualizer,
    isVirtualized,
    layoutActions,
  ])

  if (taggedOps.size === 0) {
    return <h3> No operations defined in spec!</h3>
  }

  const OperationContainer = getComponent("OperationContainer", true)
  const OperationTag = getComponent("OperationTag")

  if (!isVirtualized) {
    return (
      <div>
        {taggedOps
          .map((tagObj, tag) => (
            <OperationTag
              key={"operation-" + tag}
              tagObj={tagObj}
              tag={tag}
              oas3Selectors={oas3Selectors}
              layoutSelectors={layoutSelectors}
              layoutActions={layoutActions}
              getConfigs={getConfigs}
              getComponent={getComponent}
              specUrl={specSelectors.url()}
            >
              <div className="operation-tag-content">
                {tagObj
                  .get("operations")
                  .map((op) => {
                    const path = op.get("path")
                    const method = op.get("method")
                    const specPath = op.get("specPath")
                    if (validOperationMethods.indexOf(method) === -1) {
                      return null
                    }
                    return (
                      <OperationContainer
                        key={`${path}-${method}`}
                        specPath={specPath}
                        op={op}
                        path={path}
                        method={method}
                        tag={tag}
                      />
                    )
                  })
                  .toArray()}
              </div>
            </OperationTag>
          ))
          .valueSeq()
          .toArray()}
      </div>
    )
  }

  return (
    <div ref={listRef} className="operations-virtual">
      <div
        className="operations-virtual__list"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((vItem) => {
          const item = flatItems[vItem.index]

          return (
            <div
              key={vItem.key}
              data-index={vItem.index}
              ref={virtualizer.measureElement}
              className="operations-virtual__item"
              style={{
                transform: `translateY(${vItem.start - virtualizer.options.scrollMargin}px)`,
              }}
            >
              {item.type === "tag" ? (
                <OperationTag
                  tagObj={item.tagObj}
                  tag={item.tag}
                  oas3Selectors={oas3Selectors}
                  layoutSelectors={layoutSelectors}
                  layoutActions={layoutActions}
                  getConfigs={getConfigs}
                  getComponent={getComponent}
                  specUrl={specSelectors.url()}
                />
              ) : (
                <OperationContainer
                  specPath={item.specPath}
                  op={item.op}
                  path={item.path}
                  method={item.method}
                  tag={item.tag}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

Operations.propTypes = {
  specSelectors: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  oas3Actions: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  oas3Selectors: PropTypes.object.isRequired,
  layoutSelectors: PropTypes.object.isRequired,
  layoutActions: PropTypes.object.isRequired,
  authActions: PropTypes.object.isRequired,
  authSelectors: PropTypes.object.isRequired,
  getConfigs: PropTypes.func.isRequired,
  fn: PropTypes.object.isRequired,
}

export default Operations
