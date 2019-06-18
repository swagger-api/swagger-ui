/**
 * @prettier
 */

import React from "react"
import { stringify } from "core/utils"

export default function Example(props) {
  const { example, omitValue, getComponent } = props

  const Markdown = getComponent("Markdown")
  const HighlightCode = getComponent("highlightCode")

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
      {!omitValue && example.has("value") ? (
        <section className="example__section">
          <div className="example__section-header">Example Value</div>
          <HighlightCode value={stringify(example.get("value"))} />
        </section>
      ) : null}
    </div>
  )
}
