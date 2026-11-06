/**
 * @prettier
 */
import React, { useCallback } from "react"
import PropTypes from "prop-types"

import { useComponent } from "../../hooks"

/**
 * `.json-schema-2020-12-accordion`, the dark-mode `.json-schema-2020-12 button`
 * rules, and the forced-colors rule for its icon (`src/style/_buttons.scss`).
 */
const ACCORDION =
  "sui:outline-none sui:border-none sui:pl-0 sui:dark:bg-json-schema-dark-background sui:dark:[&_svg]:text-json-schema-dark-text sui:forced-colors:[&_svg_path]:forced-color-adjust-none sui:forced-colors:[&_svg_path]:fill-[ButtonText]"

/** `.json-schema-2020-12-accordion__children`. */
const ACCORDION_CHILDREN = "sui:inline-block"

/** `.json-schema-2020-12-accordion__icon--{expanded,collapsed}`. */
const ACCORDION_ICON = {
  expanded:
    "sui:inline-block sui:w-[18px] sui:h-[18px] sui:align-bottom sui:transition-transform sui:duration-150 sui:ease-[ease-in] sui:origin-center sui:-rotate-90 sui:[&_svg]:w-[20px] sui:[&_svg]:h-[20px]",
  collapsed:
    "sui:inline-block sui:w-[18px] sui:h-[18px] sui:align-bottom sui:transition-transform sui:duration-150 sui:ease-[ease-in] sui:origin-center sui:rotate-0 sui:[&_svg]:w-[20px] sui:[&_svg]:h-[20px]",
} as const

export interface AccordionProps {
  expanded?: boolean
  children: React.ReactNode
  onChange: (event: unknown, expandedNew: boolean) => void
}

const Accordion = ({
  expanded = false,
  children,
  onChange,
}: AccordionProps) => {
  const ChevronRightIcon = useComponent("ChevronRightIcon")

  const handleExpansion = useCallback(
    (event: unknown) => {
      onChange(event, !expanded)
    },
    [expanded, onChange]
  )

  return (
    <button
      type="button"
      className={ACCORDION}
      data-expanded={expanded ? "true" : "false"}
      onClick={handleExpansion}
    >
      <div className={ACCORDION_CHILDREN}>{children}</div>
      <span
        className={
          expanded ? ACCORDION_ICON.expanded : ACCORDION_ICON.collapsed
        }
      >
        <ChevronRightIcon />
      </span>
    </button>
  )
}

Accordion.propTypes = {
  expanded: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default Accordion
