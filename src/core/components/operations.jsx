import React from "react"
import PropTypes from "prop-types"
import Im from "immutable"

const SWAGGER2_OPERATION_METHODS = [
  "get", "put", "post", "delete", "options", "head", "patch"
]

const OAS3_OPERATION_METHODS = SWAGGER2_OPERATION_METHODS.concat(["trace"])

export default class Operations extends React.Component {

  static propTypes = {
    specSelectors: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    oas3Actions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    oas3Selectors: PropTypes.func.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    authSelectors: PropTypes.object.isRequired,
    getConfigs: PropTypes.func.isRequired,
    fn: PropTypes.func.isRequired
  };

  render() {
    let {
      specSelectors,
      getComponent,
      oas3Selectors,
      layoutSelectors,
      layoutActions,
      getConfigs,
      fn
    } = this.props

    // Get pertinent options
    let {
      maxDisplayedTags,
      hierarchicalTags,
      tagSplitterChar,
    } = getConfigs();

    // Set default tagSplitterChar if necessary
    tagSplitterChar = tagSplitterChar || /[:|]/;

    // Get a flat map of tag names to tag info and operations. Note that this will always return a
    // flat list, even if the `hierarchicalTags` option is set to `true`.
    let taggedOps = specSelectors.taggedOperations()

    // Filter, if requested
    let filter = layoutSelectors.currentFilter()
    if (filter) {
      if (filter !== true && filter !== "true" && filter !== "false") {
        taggedOps = fn.opsFilter(taggedOps, filter)
      }
    }

    // Limit to [max] items, if specified
    if (maxDisplayedTags && !isNaN(maxDisplayedTags) && maxDisplayedTags >= 0) {
      taggedOps = taggedOps.slice(0, maxDisplayedTags)
    }

    // Render either hierarchical or flat depending on config
    if (hierarchicalTags) {
      // If the `hierarchicalTags` option is set, we want to break down the tags into a deep
      // hierarchy. We're using a "raw" object for cleanliness here, but later we'll convert that
      // into an immutable map. Here are the types we're dealing with:
      //
      // const operationTagsRaw: TagMap;
      // type TagMap = { [TagName: string]: TagData };
      // type TagData = {
      //   canonicalName: string;
      //   data: TagInfoAndOperations | null;
      //   childTags: TagMap;
      // }
      // TODO: Explicitly define TagInfoAndOperations

      const operationTagsRaw = {};

      // For each raw tag....
      taggedOps.map((tagObj, tagName) => {
        // Split the raw tag name into parts
        const parts = tagName.split(tagSplitterChar);

        // Set a pointer for use in traversing the hierarchy
        let current = operationTagsRaw;

        // Iterate through the parts defined by this tag
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];

          // If there's no object defined for the current part, define one with just childTags as an
          // empty set
          if (current[part] === undefined) {
            // Compose canonical name from parts up to this point
            const canonicalName = parts.reduce(
              (name, p, j) => ((j > i) ? name : name.concat([p])),
              []
            ).join("|");
            current[part] = {
              canonicalName,
              data: null,
              childTags: {}
            }
          }

          // If this is the last part, set data on this object
          if (i === parts.length - 1) {
            current[part].data = tagObj;
          }

          // Move to the next level of the hierarchy before looping around
          current = current[part].childTags;
        }
      });

      // Convert to immutable map
      const operationTags = Im.fromJS(operationTagsRaw);
      const HierarchicalOperationTag = getComponent("HierarchicalOperationTag")
      return operationTags.size === 0
        ? <h3> No operations defined in spec!</h3>
        :
        <HierarchicalOperationTag
          specSelectors={specSelectors}
          oas3Selectors={oas3Selectors}
          layoutSelectors={layoutSelectors}
          layoutActions={layoutActions}
          getConfigs={getConfigs}
          getComponent={getComponent}
          childTags={operationTags}
          isRoot={true}
        />
    } else {
      const OperationContainer = getComponent("OperationContainer", true)
      const OperationTag = getComponent("OperationTag")
      return (
          <div>
            {
              taggedOps.map( (tagObj, tag) => {
                const operations = tagObj.get("operations")
                return (
                  <OperationTag
                    key={"operation-" + tag}
                    tagObj={tagObj}
                    tag={tag}
                    oas3Selectors={oas3Selectors}
                    layoutSelectors={layoutSelectors}
                    layoutActions={layoutActions}
                    getConfigs={getConfigs}
                    getComponent={getComponent}
                    specUrl={specSelectors.url()}>
                    {
                      operations.map( op => {
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
                                   key={`${path}-${method}`}
                                   specPath={specPath}
                                   op={op}
                                   path={path}
                                   method={method}
                                   tag={tag}
                                   />
                      }).toArray()
                    }


                  </OperationTag>
                )
              }).toArray()
            }

            { taggedOps.size < 1 ? <h3> No operations defined in spec! </h3> : null }
          </div>
      )
    }
  }
}

Operations.propTypes = {
  layoutActions: PropTypes.object.isRequired,
  specSelectors: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  layoutSelectors: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  fn: PropTypes.object.isRequired
}
