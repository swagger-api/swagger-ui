/**
 * @prettier
 */
import React, { useCallback } from "react"

/**
 * `.json-schema-2020-12-expand-deep-button` (text_headline font, then 12px and
 * a light gray), plus the dark-mode `.json-schema-2020-12 button` background.
 */
const EXPAND_DEEP_BUTTON =
  "sui:font-[family-name:sans-serif] sui:text-[12px] sui:text-json-schema-expand-deep sui:border-none sui:pr-0 sui:dark:text-json-schema-dark-muted sui:dark:bg-json-schema-dark-background"

export interface ExpandDeepButtonProps {
  expanded: boolean
  onClick: (event: unknown, expandedDeepNew: boolean) => void
}

const ExpandDeepButton = ({ expanded, onClick }: ExpandDeepButtonProps) => {
  const handleExpansion = useCallback(
    (event: unknown) => {
      onClick(event, !expanded)
    },
    [expanded, onClick]
  )

  return (
    <button
      type="button"
      className={EXPAND_DEEP_BUTTON}
      onClick={handleExpansion}
    >
      {expanded ? "Collapse all" : "Expand all"}
    </button>
  )
}

export default ExpandDeepButton
