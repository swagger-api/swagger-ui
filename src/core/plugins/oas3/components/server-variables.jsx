import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

export default class ServerVariables extends PureComponent {
  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    currentServer: ImPropTypes.string.isRequired,
    serverVariableDefs: ImPropTypes.orderedMap.isRequired,
    onChange: PropTypes.func.isRequired,
    getServerVariable: PropTypes.func.isRequired,
    getEffectiveServerValue: PropTypes.func.isRequired
  }

  render() {
    const {
      getComponent,
      serverVariableDefs,
      getServerVariable,
      currentServer,
      onChange,
      getEffectiveServerValue
    } = this.props

    const DropDown = getComponent("DropDown")
    const DropDownItem = getComponent("DropDownItem")
    const Input = getComponent("Input")
    
    return (
      <div>
        {
          serverVariableDefs.map((val, name) => {
            return (
                <div key={name}>
                { 
                  val.get("enum") 
                    ? <label className="servers__control" htmlFor={name}>
                        <span className="server-variable-title">{name}</span>
                        <DropDown
                          label={name}
                          data-variable={name}
                          onChange={onChange}
                          value={getServerVariable(currentServer, name)}
                        >
                          {
                            val.get("enum").map(enumValue => (
                              <DropDownItem
                                key={enumValue}
                                value={enumValue}>
                                {enumValue}
                              </DropDownItem>
                            )
                          )}
                        </DropDown>
                      </label>
                    : <label className="servers__control">
                        <span>{name}</span>
                        <Input
                          type={"text"}
                          value={getServerVariable(currentServer, name) || ""}
                          onChange={onChange}
                          data-variable={name}
                        />
                      </label>  
                }
              </div>
            )
          })
        }
        <div className="computed-url">
          <label htmlFor="computed-url">
            <div>
              <span>Computed URL:</span>
              <code className="computed-url__code">
                {getEffectiveServerValue(currentServer)}
              </code>
            </div>
          </label>
        </div>
      </div>
    )
  }
}