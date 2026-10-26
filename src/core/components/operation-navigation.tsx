/**
 * @prettier
 */
import React, { useCallback, useRef, useState } from "react"
import { opId } from "swagger-client/es/helpers"
import { escapeDeepLinkPath } from "core/utils"

type Operation = {
  get: (key: string) => unknown
  getIn: (path: string[]) => unknown
}

type TagGroup = {
  get: (key: string) => { forEach: (callback: (op: Operation) => void) => void }
}

type NavigationOperation = {
  method: string
  path: string
  summary: string
  operationId: string
}

type NavigationGroup = {
  tag: string
  operations: NavigationOperation[]
}

type Props = {
  specSelectors: {
    taggedOperations: () => {
      entrySeq: () => {
        forEach: (callback: (entry: [string, TagGroup]) => void) => void
      }
    }
    validOperationMethods: () => string[]
  }
  layoutSelectors: {
    isShown: (key: string[], defaultValue: boolean) => boolean
  }
  layoutActions: {
    show: (key: string[], shown: boolean) => void
    scrollTo: (key: string[]) => void
    scrollToVirtualizedOperation: (key: string[]) => void
    scrollToElement: (element: Element) => void
    clearScrollTo: () => void
    clearScrollToVirtualizedOperation: () => void
  }
  getConfigs: () => { docExpansion: string }
}

const OperationNavigation = ({
  specSelectors,
  layoutSelectors,
  layoutActions,
  getConfigs,
}: Props) => {
  const [search, setSearch] = useState("")
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set())
  const [collapsedSearchTags, setCollapsedSearchTags] = useState<Set<string>>(
    new Set()
  )
  const navRef = useRef<HTMLElement>(null)
  const validMethods = specSelectors.validOperationMethods()
  const groups: NavigationGroup[] = []

  specSelectors
    .taggedOperations()
    .entrySeq()
    .forEach(([tag, tagGroup]) => {
      const operations: NavigationOperation[] = []
      tagGroup.get("operations").forEach((op) => {
        const method = op.get("method")
        const path = op.get("path")
        if (
          typeof method !== "string" ||
          typeof path !== "string" ||
          !validMethods.includes(method)
        ) {
          return
        }

        const operationId = String(
          op.getIn(["operation", "__originalOperationId"]) ||
            op.getIn(["operation", "operationId"]) ||
            opId(op.get("operation"), path, method) ||
            op.get("id") ||
            ""
        )

        if (!operationId) return

        operations.push({
          method,
          path,
          operationId,
          summary: String(op.getIn(["operation", "summary"]) || ""),
        })
      })

      if (operations.length > 0) groups.push({ tag, operations })
    })

  const normalizedSearch = search.trim().toLowerCase()
  const visibleGroups = groups
    .map(({ tag, operations }) => ({
      tag,
      operations: operations.filter(
        ({ method, path, summary, operationId }) =>
          !normalizedSearch ||
          [tag, method, path, summary, operationId].some((value) =>
            value.toLowerCase().includes(normalizedSearch)
          )
      ),
    }))
    .filter(({ operations }) => operations.length > 0)

  const toggleTag = useCallback(
    (tag: string) => {
      if (normalizedSearch) {
        setCollapsedSearchTags((current) => {
          const next = new Set(current)
          if (next.has(tag)) next.delete(tag)
          else next.add(tag)
          return next
        })
      } else {
        setExpandedTags((current) => {
          const next = new Set(current)
          if (next.has(tag)) next.delete(tag)
          else next.add(tag)
          return next
        })
      }
    },
    [normalizedSearch]
  )

  const onSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value)
      setCollapsedSearchTags(new Set())
    },
    []
  )

  const onTagClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const { tag } = event.currentTarget.dataset
      if (tag !== undefined) toggleTag(tag)
    },
    [toggleTag]
  )

  const navigateTo = useCallback(
    (tag: string, operationId: string) => {
      const tagKey = ["operations-tag", tag]
      const operationKey = ["operations", tag, operationId]
      const { docExpansion } = getConfigs()

      if (
        !layoutSelectors.isShown(
          tagKey,
          docExpansion === "list" || docExpansion === "full"
        )
      ) {
        layoutActions.show(tagKey, true)
      }
      layoutActions.show(operationKey, true)
      layoutActions.scrollTo(operationKey)
      layoutActions.scrollToVirtualizedOperation(operationKey)

      // Already mounted operations do not remount, so their deep-link wrapper
      // cannot consume the scroll request. Scroll those directly after render.
      window.requestAnimationFrame(() => {
        const root = navRef.current?.closest(".swagger-ui")
        const targetId = escapeDeepLinkPath(operationKey.join("-"))
        let target: HTMLElement | null = null
        root?.querySelectorAll<HTMLElement>(".opblock").forEach((element) => {
          if (element.id === targetId) target = element
        })

        if (target) {
          layoutActions.scrollToElement(target)
          layoutActions.clearScrollTo()
          layoutActions.clearScrollToVirtualizedOperation()
        }
      })
    },
    [getConfigs, layoutSelectors, layoutActions]
  )

  const onOperationClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const { tag, operationId } = event.currentTarget.dataset
      if (tag !== undefined && operationId) navigateTo(tag, operationId)
    },
    [navigateTo]
  )

  if (groups.length === 0) return null

  return (
    <nav
      className="operation-navigation"
      aria-label="API endpoints"
      ref={navRef}
    >
      <h2 className="operation-navigation__heading">Endpoints</h2>
      <label className="operation-navigation__search-label">
        <span>Search endpoints</span>
        <input
          className="operation-navigation__search"
          type="search"
          value={search}
          onChange={onSearchChange}
        />
      </label>
      {visibleGroups.length === 0 ? (
        <p className="operation-navigation__empty" role="status">
          No matching endpoints.
        </p>
      ) : (
        <ul className="operation-navigation__groups">
          {visibleGroups.map(({ tag, operations }) => {
            const isExpanded = normalizedSearch
              ? !collapsedSearchTags.has(tag)
              : expandedTags.has(tag)

            return (
              <li className="operation-navigation__group" key={tag}>
                <button
                  type="button"
                  className="operation-navigation__tag"
                  data-tag={tag}
                  aria-expanded={isExpanded}
                  onClick={onTagClick}
                >
                  <span className="operation-navigation__tag-name">{tag}</span>
                  <span className="operation-navigation__count">
                    {operations.length}
                  </span>
                </button>
                {isExpanded && (
                  <ul className="operation-navigation__items">
                    {operations.map(
                      ({ method, path, summary, operationId }) => (
                        <li key={`${method}-${path}-${operationId}`}>
                          <button
                            type="button"
                            className="operation-navigation__item"
                            data-tag={tag}
                            data-operation-id={operationId}
                            onClick={onOperationClick}
                          >
                            <span className="operation-navigation__method">
                              {method}
                            </span>
                            <span className="operation-navigation__path">
                              {path}
                            </span>
                            {summary && (
                              <span className="operation-navigation__summary">
                                {summary}
                              </span>
                            )}
                          </button>
                        </li>
                      )
                    )}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </nav>
  )
}

export default OperationNavigation
