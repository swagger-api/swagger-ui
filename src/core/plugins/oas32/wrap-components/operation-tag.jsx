/**
 * @prettier
 */
import React from "react"

/**
 * OperationTag wrapper for OAS 3.2
 *
 * Enhances the tag display with OAS 3.2 specific fields:
 * - summary: Short summary of the tag
 * - kind: Tag categorization (e.g., "webhook", "callback")
 * - parent: Hierarchical parent tag reference
 */
/* eslint-disable react/prop-types */
const OAS32OperationTagWrapper = (Original, system) => (props) => {
  const { specSelectors, getComponent } = system
  const isOAS32 = specSelectors.isOAS32 && specSelectors.isOAS32()

  if (!isOAS32) {
    return <Original {...props} />
  }

  const { tag } = props
  const Markdown = getComponent("Markdown", true)

  // Get OAS 3.2 tag fields
  const tagSummary = specSelectors.selectTagSummaryField
    ? specSelectors.selectTagSummaryField(tag)
    : null
  const tagKind = specSelectors.selectTagKindField
    ? specSelectors.selectTagKindField(tag)
    : null
  const tagParent = specSelectors.selectTagParentField
    ? specSelectors.selectTagParentField(tag)
    : null

  const hasExtensions = tagSummary || tagKind || tagParent

  return (
    <div className="oas32-tag-wrapper">
      <Original {...props} />

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
/* eslint-enable react/prop-types */

export default OAS32OperationTagWrapper
