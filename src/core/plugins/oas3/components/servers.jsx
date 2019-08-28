import React from "react"
import { OrderedMap } from "immutable"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import Markdown from "react-remarkable"

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

    //fire 'change' event to set default 'value' of select
    this.setServer(servers.first().get("url"))
    this.localInputChange = false
  }

  componentWillReceiveProps(nextProps) {
    let {
      servers,
      setServerVariableValue,
      getServerVariable
    } = this.props

    const nextServerDefinition = nextProps.servers.find(v => v.get("url") === nextProps.currentServer) || OrderedMap()
    const nextServerVariableDefs = nextServerDefinition.get("variables") || OrderedMap()

    nextServerVariableDefs.map((val, key) => {
      const currentDefaultValue = getServerVariable(this.props.currentServer, key)
      const nextDefaultValue = val.get("default")

      if (currentDefaultValue !== nextDefaultValue) {
        this.shouldUpdateForm = true
      }
    })

    if( (this.props.currentServer !== nextProps.currentServer) || this.shouldUpdateForm) {
      // Server has changed, we may need to set default values
      const currentServerDefinition = servers
        .find(v => v.get("url") === nextProps.currentServer)

      if(!currentServerDefinition) {
        return this.setServer(servers.first().get("url"))
      }

      nextServerVariableDefs.map((val, key) => {
        const currentValue = getServerVariable(nextProps.currentServer, key)
        const currentDefaultValue = getServerVariable(this.props.currentServer, key)
        const nextDefaultValue = val.get("default")
        // only set the default value if the user hasn't set one yet or if the change comes from default value change through props
        if(((currentDefaultValue !== nextDefaultValue) && !this.localInputChange) || !currentValue) {
          setServerVariableValue({
            server: nextProps.currentServer,
            key,
            val: val.get("default") || ""
          })
        }
      })

      //Once update is made, reset values of the update triggers back to false
      if (this.shouldUpdateForm) {
        this.shouldUpdateForm = false
      }
      if (this.localInputChange) {
        this.localInputChange = false
      }
    }
  }

  onServerChange =( e ) => {
    this.setServer( e.target.value )

    // set default variable values
  }

  onServerVariableValueChange = ( e ) => {
    this.localInputChange = true //Trigger to let UI know change is coming from input field

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


    let currentServerDefinition = servers.find(v => v.get("url") === currentServer) || OrderedMap()

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
              </option>
            ).toArray()}
          </select>
          {
            currentServerDefinition.get("description") && <div className={"servers-ui-description"}>
                <Markdown source={currentServerDefinition.get("description")} />
              </div>
          }
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
                  currentServerVariableDefs.map((val, name) => {
                    return <tr key={name}>
                      <td style={{verticalAlign: "top", marginTop: "10px"}}>{name}</td>
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
                        {
                          val.get("description") && <div>
                              <Markdown source={val.get("description")} />
                            </div>
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
