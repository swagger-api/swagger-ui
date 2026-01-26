/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

/**
 * OperationTag wrapper for OAS 3.2
 *
 * Enhances the tag display with OAS 3.2 specific fields:
 * - summary: Short summary of the tag
 * - kind: Tag categorization (e.g., "webhook", "callback")
 * - parent: Hierarchical parent tag reference
 */
const OAS32OperationTagWrapper = (Original) => {
  return class OAS32OperationTag extends React.Component {
    static propTypes = {
      tagObj: ImPropTypes.map.isRequired,
      tag: PropTypes.string.isRequired,
      specSelectors: PropTypes.object.isRequired,
      getComponent: PropTypes.func.isRequired,
    }

    render() {
      const { specSelectors, tag } = this.props
      const isOAS32 = specSelectors.isOAS32()

      if (!isOAS32) {
        return <Original {...this.props} />
      }

      const Markdown = this.props.getComponent("Markdown", true)

      // Get OAS 3.2 tag fields
      const tagSummary = specSelectors.selectTagSummaryField(tag)
      const tagKind = specSelectors.selectTagKindField(tag)
      const tagParent = specSelectors.selectTagParentField(tag)

      return (
        <div className="oas32-tag-wrapper">
          <Original {...this.props} />

          {(tagSummary || tagKind || tagParent) && (
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
  }
}

export default OAS32OperationTagWrapper
