import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import Im from "immutable"
import { createDeepLinkPath, escapeDeepLinkPath, sanitizeUrl } from "core/utils"
import { buildUrl } from "core/utils/url"
import { isFunc } from "core/utils"

const SWAGGER2_OPERATION_METHODS = [
  "get", "put", "post", "delete", "options", "head", "patch"
]

const OAS3_OPERATION_METHODS = SWAGGER2_OPERATION_METHODS.concat(["trace"])

export default class OperationTag extends React.Component {

  static defaultProps = {
    tagObj: Im.fromJS({}),
    tag: "",
  }

  static propTypes = {
    tagObj: ImPropTypes.map,
    tag: PropTypes.string,
    childTags: ImPropTypes.map.isRequired,
    isRoot: PropTypes.bool,

    oas3Selectors: PropTypes.func.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,

    getConfigs: PropTypes.func.isRequired,
    getComponent: PropTypes.func.isRequired,

    specUrl: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.renderChildTags = this.renderChildTags.bind(this);
  }

  render() {
    // If this is the root element, just render the child tags
    if (this.props.isRoot) {
      return this.renderChildTags();
    }

    // Otherwise, we're rendering the individual elements, so proceed with full render

    // Get the necessary props
    const {
      tagObj,
      tag,
      oas3Selectors,
      layoutSelectors,
      layoutActions,
      getConfigs,
      getComponent,
      specSelectors,
      specUrl,
    } = this.props

    // Get the necessary configs
    let {
      docExpansion,
      deepLinking,
    } = getConfigs()

    // Get the necessary components
    const OperationContainer = getComponent("OperationContainer", true)
    const Collapse = getComponent("Collapse")
    const Markdown = getComponent("Markdown", true)
    const DeepLink = getComponent("DeepLink")
    const Link = getComponent("Link")

    // Set up some helpers
    const isDeepLinkingEnabled = deepLinking && deepLinking !== "false"

    const tagDescription = tagObj ? tagObj.getIn(["tagDetails", "description"], null) : null;
    const tagExternalDocsDescription = tagObj ? tagObj.getIn(["tagDetails", "externalDocs", "description"]) : null;
    const rawTagExternalDocsUrl = tagObj ? tagObj.getIn(["tagDetails", "externalDocs", "url"]) : null;
    const tagExternalDocsUrl = (isFunc(oas3Selectors) && isFunc(oas3Selectors.selectedServer))
      ? buildUrl(rawTagExternalDocsUrl, specUrl, { selectedServer: oas3Selectors.selectedServer() })
      : rawTagExternalDocsUrl;
    const operations = tagObj ? tagObj.get("operations") : Im.fromJS({});

    const isShownKey = ["operations-tag", tag]
    const showTag = layoutSelectors.isShown(isShownKey, docExpansion === "full" || docExpansion === "list")

    // Finally, render
    return (
      <div className={showTag ? "opblock-tag-section is-open" : "opblock-tag-section"} >

        <h4
          onClick={() => layoutActions.show(isShownKey, !showTag)}
          className={!tagDescription ? "opblock-tag no-desc" : "opblock-tag" }
          id={isShownKey.map(v => escapeDeepLinkPath(v)).join("-")}
          data-tag={tag}
          data-is-open={showTag}
          >
          <DeepLink
            enabled={isDeepLinkingEnabled}
            isShown={showTag}
            path={createDeepLinkPath(tag)}
            text={tag} />
          { !tagDescription ? <small></small> :
            <small>
                <Markdown source={tagDescription} />
              </small>
            }

            <div>
              { !tagExternalDocsDescription ? null :
                <small>
                    { tagExternalDocsDescription }
                      { tagExternalDocsUrl ? ": " : null }
                      { tagExternalDocsUrl ?
                        <Link
                            href={sanitizeUrl(tagExternalDocsUrl)}
                            onClick={(e) => e.stopPropagation()}
                            target="_blank"
                            >{tagExternalDocsUrl}</Link> : null
                          }
                  </small>
                }
            </div>

            <button
              className="expand-operation"
              title={showTag ? "Collapse operation": "Expand operation"}
              onClick={() => layoutActions.show(isShownKey, !showTag)}>

              <svg className="arrow" width="20" height="20">
                <use href={showTag ? "#large-arrow-down" : "#large-arrow"} xlinkHref={showTag ? "#large-arrow-down" : "#large-arrow"} />
              </svg>
            </button>
        </h4>

        <Collapse isOpened={showTag}>
          <div className="hierarchical-operation-tag-operations">
            {
              operations.map(op => {
                const path = op.get("path")
                const method = op.get("method")
                const specPath = Im.List(["paths", path, method])


                // FIXME: (someday) this logic should probably be in a selector,
                // but doing so would require further opening up
                // selectors to the plugin system, to allow for dynamic
                // overriding of low-level selectors that other selectors
                // rely on. --KS, 12/17
                const validMethods = specSelectors.isOAS3() ?
                  OAS3_OPERATION_METHODS : SWAGGER2_OPERATION_METHODS

                if(validMethods.indexOf(method) === -1) {
                  return null
                }

                return <OperationContainer
                  key={`${method}-${path}`}
                  specPath={specPath}
                  op={op}
                  path={path}
                  method={method}
                  tag={tag}
                />
              }).toArray()
            }
          </div>

          { this.renderChildTags() }
        </Collapse>
      </div>
    )
  }

  renderChildTags() {
    const { childTags } = this.props;
    if (!childTags || childTags.size === 0) {
      return null;
    }

    const {
      oas3Selectors,
      layoutSelectors,
      layoutActions,
      getConfigs,
      getComponent,
      specSelectors,
      isRoot,
    } = this.props;

    return (
      <div className="hierarchical-operation-tags" style={isRoot ? null : {margin: "0 0 0 2rem"}}>
      {
        childTags.map((tag, tagName) => {
          return <OperationTag
            key={"operation-" + (tag.get("canonicalTagName") || tagName)}
            tagObj={tag.get("data")}
            tag={tagName}
            specSelectors={specSelectors}
            oas3Selectors={oas3Selectors}
            layoutSelectors={layoutSelectors}
            layoutActions={layoutActions}
            getConfigs={getConfigs}
            getComponent={getComponent}
            childTags={tag.get("childTags")}
            isRoot={false}
          />
        }).toArray()
      }
      </div>
    )
  }
}
