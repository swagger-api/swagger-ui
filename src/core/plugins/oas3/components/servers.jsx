/**
 * @prettier
 */
import React, { useCallback, useEffect } from "react"
import { OrderedMap } from "immutable"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

const Servers = ({
  servers,
  currentServer,
  setSelectedServer,
  setServerVariableValue,
  getServerVariable,
  getEffectiveServerValue,
}) => {
  const currentServerDefinition =
    servers.find((s) => s.get("url") === currentServer) || OrderedMap()
  const currentServerVariableDefs =
    currentServerDefinition.get("variables") || OrderedMap()
  const shouldShowVariableUI = currentServerVariableDefs.size !== 0

  useEffect(() => {
    if (currentServer) return

    // fire 'change' event to set default 'value' of select
    setSelectedServer(servers.first()?.get("url"))
  }, [])

  useEffect(() => {
    // server has changed, we may need to set default values
    const currentServerDefinition = servers.find(
      (server) => server.get("url") === currentServer
    )
    if (!currentServerDefinition) {
      setSelectedServer(servers.first().get("url"))
      return
    }

    const currentServerVariableDefs =
      currentServerDefinition.get("variables") || OrderedMap()
    currentServerVariableDefs.map((val, key) => {
      setServerVariableValue({
        server: currentServer,
        key,
        val: val.get("default") || "",
      })
    })
  }, [currentServer, servers])

  const handleServerChange = useCallback(
    (e) => {
      setSelectedServer(e.target.value)
    },
    [setSelectedServer]
  )

  const handleServerVariableChange = useCallback(
    (e) => {
      const variableName = e.target.getAttribute("data-variable")
      const newVariableValue = e.target.value

      setServerVariableValue({
        server: currentServer,
        key: variableName,
        val: newVariableValue,
      })
    },
    [setServerVariableValue, currentServer]
  )

  return (
    <div className="servers">
      <label htmlFor="servers">
        <select
          onChange={handleServerChange}
          value={currentServer}
          id="servers"
        >
          {servers
            .valueSeq()
            .map((server) => (
              <option value={server.get("url")} key={server.get("url")}>
                {server.get("url")}
                {server.get("description") && ` - ${server.get("description")}`}
              </option>
            ))
            .toArray()}
        </select>
      </label>
      {shouldShowVariableUI && (
        <div>
          <div className={"computed-url"}>
            Computed URL:
            <code>{getEffectiveServerValue(currentServer)}</code>
          </div>
          <h4>Server variables</h4>
          <table>
            <tbody>
              {currentServerVariableDefs.entrySeq().map(([name, val]) => {
                return (
                  <tr key={name}>
                    <td>{name}</td>
                    <td>
                      {val.get("enum") ? (
                        <select
                          data-variable={name}
                          onChange={handleServerVariableChange}
                        >
                          {val.get("enum").map((enumValue) => {
                            return (
                              <option
                                selected={
                                  enumValue ===
                                  getServerVariable(currentServer, name)
                                }
                                key={enumValue}
                                value={enumValue}
                              >
                                {enumValue}
                              </option>
                            )
                          })}
                        </select>
                      ) : (
                        <input
                          type={"text"}
                          value={getServerVariable(currentServer, name) || ""}
                          onChange={handleServerVariableChange}
                          data-variable={name}
                        ></input>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
Servers.propTypes = {
  servers: ImPropTypes.list.isRequired,
  currentServer: PropTypes.string.isRequired,
  setSelectedServer: PropTypes.func.isRequired,
  setServerVariableValue: PropTypes.func.isRequired,
  getServerVariable: PropTypes.func.isRequired,
  getEffectiveServerValue: PropTypes.func.isRequired,
}

export default Servers
