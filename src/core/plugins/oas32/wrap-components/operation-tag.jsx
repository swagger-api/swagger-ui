/**
 * @prettier
 */
import React from "react"

import { createOnlyOAS32ComponentWrapper } from "../fn"

/**
 * OperationTag wrapper for OAS 3.2
 *
 * Enhances the tag display with OAS 3.2 specific fields:
 * - summary: Short summary of the tag
 * - kind: Tag categorization (e.g., "webhook", "callback")
 * - parent: Hierarchical parent tag reference
 */
const OAS32OperationTagWrapper = createOnlyOAS32ComponentWrapper(
  ({ getSystem, ...props }) => {
    const system = getSystem()
    const { specSelectors, getComponent } = system
    const { tag } = props

    const OperationTag = getComponent("OperationTag", true)
    const Markdown = getComponent("Markdown", true)

    // Get OAS 3.2 tag fields
    const tagSummary = specSelectors.selectTagSummaryField(tag)
    const tagKind = specSelectors.selectTagKindField(tag)
    const tagParent = specSelectors.selectTagParentField(tag)

    const hasExtensions = tagSummary || tagKind || tagParent

    return (
      <div className="oas32-tag-wrapper">
        <OperationTag {...props} />

        {hasExtensions && (
          <div className="oas32-tag-extensions">
            {tagSummary && (
              <div className="oas32-tag-summary">
                <small>
                  <strong>Summary: </strong>
                  <Markdown source={tagSummary} />
                </small>
              </div>
            )}

            <div className="oas32-tag-metadata">
              {tagKind && (
                <span className="oas32-tag-kind badge">
                  <strong>Kind:</strong> {tagKind}
                </span>
              )}

              {tagParent && (
                <span className="oas32-tag-parent">
                  <small>
                    <strong>Parent:</strong> <code>{tagParent}</code>
                  </small>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
)

export default OAS32OperationTagWrapper
