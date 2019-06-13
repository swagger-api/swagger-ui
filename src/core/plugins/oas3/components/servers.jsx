import React from "react"
import { OrderedMap } from "immutable"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

export default class Servers extends React.Component {

  static propTypes = {
    servers: ImPropTypes.list.isRequired,
    currentServer: PropTypes.string.isRequired,
    setSelectedServer: PropTypes.func.isRequired,
    getComponent: PropTypes.func.isRequired,
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
  }

  componentWillReceiveProps(nextProps) {
    let {
      servers,
      setServerVariableValue,
      getServerVariable
    } = this.props

    if(this.props.currentServer !== nextProps.currentServer) {
      // Server has changed, we may need to set default values
      let currentServerDefinition = servers
        .find(v => v.get("url") === nextProps.currentServer)

      if(!currentServerDefinition) {
        return this.setServer(servers.first().get("url"))
      }

      let currentServerVariableDefs = currentServerDefinition.get("variables") || OrderedMap()

      currentServerVariableDefs.map((val, key) => {
        let currentValue = getServerVariable(nextProps.currentServer, key)
        // only set the default value if the user hasn't set one yet
        if(!currentValue) {
          setServerVariableValue({
            server: nextProps.currentServer,
            key,
            val: val.get("default") || ""
          })
        }
      })
    }
  }

  onServerChange =( target ) => {
    this.setServer( target.value )
  }

  onServerVariableValueChange = ( target ) => {
    const {
      setServerVariableValue,
      currentServer
    } = this.props

    const variableName = target["data-variable"]
    const newVariableValue = target.value

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
      getEffectiveServerValue,
      getComponent
    } = this.props

    const ServerVariables = getComponent("ServerVariables")
    const DropDown = getComponent("DropDown")
    const DropDownItem = getComponent("DropDownItem")


    let currentServerDefinition = servers.find(v => v.get("url") === currentServer) || OrderedMap()

    let currentServerVariableDefs = currentServerDefinition.get("variables") || OrderedMap()

    let shouldShowVariableUI = currentServerVariableDefs.size !== 0

    return (
      <div className="servers">
        <label className="servers__control" htmlFor="servers">
          <span>Server</span>
          <DropDown onChange={ this.onServerChange } value={ currentServer } >
            { servers.valueSeq().map(
              ( server ) =>
              <DropDownItem
                value={ server.get("url") }
                key={ server.get("url") }>
                { server.get("url") }
                { server.get("description") && ` - ${server.get("description")}` }
              </DropDownItem>
            ).toArray()}
          </DropDown>
        </label>
        { 
          shouldShowVariableUI &&
            <ServerVariables
              getComponent={getComponent}
              serverVariableDefs={currentServerVariableDefs}
              currentServer={currentServer}
              getServerVariable={getServerVariable}
              onChange={this.onServerVariableValueChange}
              getEffectiveServerValue={getEffectiveServerValue}
            />
        }
      </div>
    )
  }
}
