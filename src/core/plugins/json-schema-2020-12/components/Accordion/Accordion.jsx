/**
 * @prettier
 */
import React, { useCallback } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

import { useComponent } from "../../hooks"

const Accordion = ({ expanded, children, onChange }) => {
  const ChevronRightIcon = useComponent("ChevronRightIcon")

  const handleExpansion = useCallback(
    (event) => {
      onChange(event, !expanded)
    },
    [expanded, onChange]
  )

  return (
    <button
      type="button"
      className="json-schema-2020-12-accordion"
      onClick={handleExpansion}
    >
      <div className="json-schema-2020-12-accordion__children">{children}</div>
      <span
        className={classNames("json-schema-2020-12-accordion__icon", {
          "json-schema-2020-12-accordion__icon--expanded": expanded,
          "json-schema-2020-12-accordion__icon--collapsed": !expanded,
        })}
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

Accordion.defaultProps = {
  expanded: false,
}

export default Accordion
