/**
 * @prettier
 */

import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import { stringify } from "core/utils"
import { Map } from "immutable"

export default function Example(props) {
  const { example, showValue, getComponent } = props

  const Markdown = getComponent("Markdown", true)
  const HighlightCode = getComponent("HighlightCode", true)

  if (!example || !Map.isMap(example)) return null

  return (
    <div className="example">
      {example.get("description") ? (
        <section className="example__section">
          <div className="example__section-header">Example Description</div>
          <p>
            <Markdown source={example.get("description")} />
          </p>
        </section>
      ) : null}
      {showValue && example.has("value") ? (
        <section className="example__section">
          <div className="example__section-header">Example Value</div>
          <HighlightCode>{stringify(example.get("value"))}</HighlightCode>
        </section>
      ) : null}
    </div>
  )
}

Example.propTypes = {
  example: ImPropTypes.map.isRequired,
  showValue: PropTypes.bool,
  getComponent: PropTypes.func.isRequired,
}
