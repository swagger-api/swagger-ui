/**
 * @prettier
 */
import React, { Component } from "react"
import PropTypes from "prop-types"

/**
 * MediaTypes component for OAS 3.2
 *
 * Renders the mediaTypes from the Components Object, which are reusable
 * Media Type Objects that can be referenced throughout the specification.
 *
 * Reference: https://spec.openapis.org/oas/v3.2.0.html#components-object
 */
export default class MediaTypes extends Component {
  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
    getConfigs: PropTypes.func.isRequired,
  }

  render() {
    const {
      specSelectors,
      getComponent,
      layoutSelectors,
      layoutActions,
      getConfigs,
    } = this.props

    const mediaTypes = specSelectors.selectMediaTypes()
    const { docExpansion, defaultModelsExpandDepth } = getConfigs()

    if (!mediaTypes || !mediaTypes.size || defaultModelsExpandDepth < 0) {
      return null
    }

    const specPathBase = ["components", "mediaTypes"]
    const showMediaTypes = layoutSelectors.isShown(
      specPathBase,
      defaultModelsExpandDepth > 0 && docExpansion !== "none"
    )

    const Collapse = getComponent("Collapse")
    const ArrowUpIcon = getComponent("ArrowUpIcon")
    const ArrowDownIcon = getComponent("ArrowDownIcon")
    const Markdown = getComponent("Markdown", true)

    return (
      <section
        className={showMediaTypes ? "media-types is-open" : "media-types"}
      >
        <h4>
          <button
            aria-expanded={showMediaTypes}
            className="media-types-control"
            onClick={() => layoutActions.show(specPathBase, !showMediaTypes)}
          >
            <span>Media Types</span>
            {showMediaTypes ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </button>
        </h4>
        <Collapse isOpened={showMediaTypes}>
          {mediaTypes.entrySeq().map(([name, mediaType]) => {
            const fullPath = [...specPathBase, name]
            const isShown = layoutSelectors.isShown(fullPath, false)

            return (
              <div
                key={`media-type-${name}`}
                className="media-type-container"
                data-name={name}
              >
                <div className="media-type-header">
                  <button
                    aria-expanded={isShown}
                    className="media-type-toggle"
                    onClick={() => layoutActions.show(fullPath, !isShown)}
                  >
                    <span className="media-type-name">{name}</span>
                    {isShown ? (
                      <ArrowUpIcon className="arrow" />
                    ) : (
                      <ArrowDownIcon className="arrow" />
                    )}
                  </button>
                </div>

                <Collapse isOpened={isShown}>
                  <div className="media-type-details">
                    {/* Schema */}
                    {mediaType.get("schema") && (
                      <div className="media-type-section">
                        <h5>Schema</h5>
                        <div className="media-type-schema">
                          <pre>
                            <code>
                              {JSON.stringify(
                                mediaType.get("schema").toJS(),
                                null,
                                2
                              )}
                            </code>
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Encoding */}
                    {mediaType.get("encoding") && (
                      <div className="media-type-section">
                        <h5>Encoding</h5>
                        <div className="media-type-encoding">
                          <pre>
                            <code>
                              {JSON.stringify(
                                mediaType.get("encoding").toJS(),
                                null,
                                2
                              )}
                            </code>
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Examples */}
                    {mediaType.get("examples") && (
                      <div className="media-type-section">
                        <h5>Examples</h5>
                        <div className="media-type-examples">
                          {mediaType
                            .get("examples")
                            .entrySeq()
                            .map(([exampleName, example]) => (
                              <div
                                key={`example-${exampleName}`}
                                className="media-type-example"
                              >
                                <strong>{exampleName}</strong>
                                {example.get("summary") && (
                                  <div className="example-summary">
                                    <Markdown source={example.get("summary")} />
                                  </div>
                                )}
                                {example.get("description") && (
                                  <div className="example-description">
                                    <Markdown
                                      source={example.get("description")}
                                    />
                                  </div>
                                )}
                                {example.get("value") && (
                                  <pre>
                                    <code>
                                      {JSON.stringify(
                                        example.get("value"),
                                        null,
                                        2
                                      )}
                                    </code>
                                  </pre>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Item Schema (OAS 3.2 specific) */}
                    {mediaType.get("itemSchema") && (
                      <div className="media-type-section media-type-item-schema">
                        <span className="streaming-badge">Streaming</span>
                        <h5>Item Schema</h5>
                        <p className="item-schema-description">
                          Schema for individual items in the stream
                        </p>
                        <div className="media-type-schema">
                          <pre>
                            <code>
                              {JSON.stringify(
                                mediaType.get("itemSchema").toJS(),
                                null,
                                2
                              )}
                            </code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </Collapse>
              </div>
            )
          })}
        </Collapse>
      </section>
    )
  }
}
