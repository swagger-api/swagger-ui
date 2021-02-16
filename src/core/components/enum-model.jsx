import React from "react"
import ImPropTypes from "react-immutable-proptypes"

const EnumModel = ({ value, names, descriptions, getComponent }) => {
  let ModelCollapse = getComponent("ModelCollapse")
  const Markdown = getComponent("Markdown", true)
  const namesArray = names ? names.toArray() : []
  const descsArray = descriptions ? descriptions.toArray() : []
  let collapsedContent = <span>Array [ { value.count() } ]</span>
  return <span className="prop-enum">
    Enum:<br />
    <ModelCollapse collapsedContent={ collapsedContent }>
      [
        <table className="model"><tbody>
          {
            value.map((val, i) => {
              const name = namesArray[i]
              const desc = descsArray[i]
              return (
                <tr key={val}>
                  <td className="value">{val}</td>
                  <td>
                    {name !== undefined ? <span className="name">name: {name}</span> : null}
                    {desc !== undefined ? <Markdown source={ desc } /> : null}
                  </td>
                </tr>
              )
            })
          }
        </tbody></table>
      ]
    </ModelCollapse>
  </span>
}
EnumModel.propTypes = {
  value: ImPropTypes.iterable,
  names: ImPropTypes.iterable,
  descriptions: ImPropTypes.iterable,
  getComponent: ImPropTypes.func
}

export default EnumModel
