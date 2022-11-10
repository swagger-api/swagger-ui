import React from "react"
import { OrderedMap } from "immutable"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

export default class Servers extends React.Component {

  static propTypes = {
    servers: ImPropTypes.list.isRequired,
    currentServer: PropTypes.string.isRequired,
    setSelectedServer: PropTypes.func.isRequired,
    setServerVariableValue: PropTypes.func.isRequired,
    getServerVariable: PropTypes.func.isRequired,
    getEffectiveServerValue: PropTypes.func.isRequired
  }

  componentDidMount() {
    let { servers, currentServer } = this.props

    if(currentServer) {
      return
    }

    // fire 'change' event to set default 'value' of select
    this.setServer(servers.first()?.get("url"))
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let {
      servers,
      setServerVariableValue,
      getServerVariable
    } = nextProps
    if (this.props.currentServer !== nextProps.currentServer || this.props.servers !== nextProps.servers) {
      // Server has changed, we may need to set default values
      let currentServerDefinition = servers
        .find(v => v.get("url") === nextProps.currentServer)
      let prevServerDefinition = this.props.servers
        .find(v => v.get("url") === this.props.currentServer) || OrderedMap()
      
      if(!currentServerDefinition) {
        return this.setServer(servers.first().get("url"))
      }
      
      let prevServerVariableDefs = prevServerDefinition.get("variables") || OrderedMap()
      let prevServerVariableDefaultKey = prevServerVariableDefs.find(v => v.get("default")) || OrderedMap()
      let prevServerVariableDefaultValue = prevServerVariableDefaultKey.get("default")
      
      let currentServerVariableDefs = currentServerDefinition.get("variables") || OrderedMap()
      let currentServerVariableDefaultKey = currentServerVariableDefs.find(v => v.get("default")) || OrderedMap()
      let currentServerVariableDefaultValue = currentServerVariableDefaultKey.get("default")
      
      currentServerVariableDefs.map((val, key) => {
        let currentValue = getServerVariable(nextProps.currentServer, key)
        
        // note: it is possible for both key/val to be the same across definitions,
        // but we will try to detect a change in default values between definitions
        // only set the default value if the user hasn't set one yet
        // or if the definition appears to have changed
        if (!currentValue || prevServerVariableDefaultValue !== currentServerVariableDefaultValue) {
          setServerVariableValue({
            server: nextProps.currentServer,
            key,
            val: val.get("default") || ""
          })
        }
      })
    }
  }

  onServerChange =( e ) => {
    this.setServer( e.target.value )

    // set default variable values
  }

  onServerVariableValueChange = ( e ) => {
    let {
      setServerVariableValue,
      currentServer
    } = this.props

    let variableName = e.target.getAttribute("data-variable")
    let newVariableValue = e.target.value

    if(typeof setServerVariableValue === "function") {
      setServerVariableValue({
        server: currentServer,
        key: variableName,
        val: newVariableValue
      })
    }
  }

  setServer = ( value ) => {
    let { setSelectedServer } = this.props

    setSelectedServer(value)
  }

  render() {
    let { servers,
      currentServer,
      getServerVariable,
      getEffectiveServerValue
    } = this.props


    let currentServerDefinition = servers.find(s => s.get("url") === currentServer) || OrderedMap()

    let currentServerVariableDefs = currentServerDefinition.get("variables") || OrderedMap()

    let shouldShowVariableUI = currentServerVariableDefs.size !== 0

    return (
      <div className="servers">
        <label htmlFor="servers">
          <select onChange={ this.onServerChange } value={currentServer}>
            { servers.valueSeq().map(
              ( server ) =>
              <option
                value={ server.get("url") }
                key={ server.get("url") }>
                { server.get("url") }
                { server.get("description") && ` - ${server.get("description")}` }
              </option>
            ).toArray()}
          </select>
        </label>
        { shouldShowVariableUI ?
          <div>

            <div className={"computed-url"}>
              Computed URL:
              <code>
                {getEffectiveServerValue(currentServer)}
              </code>
            </div>
            <h4>Server variables</h4>
            <table>
              <tbody>
                {
                  currentServerVariableDefs.entrySeq().map(([name, val]) => {
                    return <tr key={name}>
                      <td>{name}</td>
                      <td>
                        { val.get("enum") ?
                          <select data-variable={name} onChange={this.onServerVariableValueChange}>
                            {val.get("enum").map(enumValue => {
                              return <option
                                selected={enumValue === getServerVariable(currentServer, name)}
                                key={enumValue}
                                value={enumValue}>
                                {enumValue}
                              </option>
                            })}
                          </select> :
                          <input
                            type={"text"}
                            value={getServerVariable(currentServer, name) || ""}
                            onChange={this.onServerVariableValueChange}
                            data-variable={name}
                            ></input>
                        }
                      </td>
                    </tr>
                  })
                }
              </tbody>
            </table>
          </div>: null
        }
      </div>
    )
  }
}
