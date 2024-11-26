import React, { Component } from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

export default class ModelWrapper extends Component {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    name: PropTypes.string,
    displayName: PropTypes.string,
    fullPath: PropTypes.array.isRequired,
    specPath: ImPropTypes.list.isRequired,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    expandDepth: PropTypes.number,
    layoutActions: PropTypes.object,
    layoutSelectors: PropTypes.object.isRequired,
    includeReadOnly: PropTypes.bool,
    includeWriteOnly: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      selectedSchema: null
    }
  }

  onToggle = (name, isShown) => {
    // If this prop is present, we'll have deepLinking for it
    if(this.props.layoutActions) {
      this.props.layoutActions.show(this.props.fullPath, isShown)
    }
  }

  onSchemaSelect = (e) => {
    const selectedSchema = e.target.value
    const schemaPath = ["components", "schemas", selectedSchema]

    const isResolved = this.props.specSelectors.specResolvedSubtree(schemaPath) != null
    if (!isResolved) {
      this.props.specActions.requestResolvedSubtree(schemaPath)
    }
    
    this.setState({ selectedSchema })
  }

  decodeRefName = (uri) => {
    const unescaped = uri.replace(/~1/g, "/").replace(/~0/g, "~")
    try {
      return decodeURIComponent(unescaped)
    } catch {
      return unescaped
    }
  }

  getModelName = (uri) => {
    if (typeof uri === "string" && uri.includes("#/components/schemas/")) {
      return this.decodeRefName(uri.replace(/^.*#\/components\/schemas\//, ""))
    }
    return null
  }

  /**
   * Builds a Map of schema options combining explicit discriminator mappings and implicit mappings.
   * 
   * @returns {Map<string, string[]>} A Map where:
   *   - key: the schema name (e.g., "Cat", "Dog")
   *   - value: array of discriminator values that map to this schema
   * 
   * Examples:
   * 1. Explicit mapping only:
   *    { "Cat": ["kitty", "kitten"], "Dog": ["puppy"] }
   * 
   * 2. Implicit mapping only:
   *    { "Cat": ["Cat"], "Dog": ["Dog"] }
   * 
   * 3. Mixed mapping:
   *    { "Cat": ["kitty", "kitten"], "Dog": ["Dog"] }
   *    where "Cat" has explicit mappings but "Dog" uses implicit
   */
  buildSchemaOptions = (name, discriminator, schemaMap) => {
    const options = new Map()
    const mapping = discriminator && discriminator.get("mapping")
    
    // First add any explicit mappings
    if (mapping && mapping.size > 0) {
      mapping.forEach((schemaRef, key) => {
        const schemaName = this.getModelName(schemaRef)
        if (schemaName) {
          const existing = options.get(schemaName) || []
          options.set(schemaName, [...existing, key])
        }
      })
    }

    // Then add implicit mappings for any schemas not already mapped
    const childSchemas = schemaMap[name] || []
    childSchemas.forEach(childName => {
      if (!options.has(childName)) {
        // No explicit mapping for this schema, use implicit
        options.set(childName, [childName])
      }
    })

    return options
  }

  render() {
    let { getComponent, getConfigs, schema, specSelectors } = this.props
    const Model = getComponent("Model")

    let expanded
    if(this.props.layoutSelectors) {
      expanded = this.props.layoutSelectors.isShown(this.props.fullPath)
    }

    const name = this.getModelName(schema.get("$$ref"))
    const schemaMap = specSelectors.getParentToChildMap()
    const discriminator = schema.get("discriminator")
    
    const options = this.buildSchemaOptions(name, discriminator, schemaMap)
    const showDropdown = !!discriminator && options.size > 0
  
    // Use selected schema or original base schema
    const effectiveSchema = this.state.selectedSchema 
      ? specSelectors.findDefinition(this.state.selectedSchema)
      : schema

    return (
      <div className="model-box">
        {showDropdown && (
          <div className="model-box-control">
            <select onChange={this.onSchemaSelect} value={this.state.selectedSchema || ""}>
              <option value="">Base: {name}</option>
              {Array.from(options.entries()).map(([schemaName, keys]) => (
                <option key={schemaName} value={schemaName}>
                  {keys.length > 1 ? `${keys.join(" | ")} (${schemaName})` : schemaName}
                </option>
              ))}
            </select>
          </div>
        )}
        <Model 
          { ...this.props }
          name={this.state.selectedSchema}
          schema={effectiveSchema}
          getConfigs={getConfigs}
          expanded={expanded}
          depth={1}
          onToggle={this.onToggle}
          expandDepth={this.props.expandDepth || 0}
        />
      </div>
    )
  }
}
