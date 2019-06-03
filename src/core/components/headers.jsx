import React from "react"
import PropTypes from "prop-types"
import Im from "immutable"

const propStyle = { color: "#999", fontStyle: "italic" }

export default class Headers extends React.Component {
  static propTypes = {
    headers: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired
  };

  render() {
    let { headers, getComponent, translate } = this.props

    const Property = getComponent("Property")
    const Markdown = getComponent("Markdown")

    if ( !headers || !headers.size )
      return null

      return (
      <div className="headers-wrapper">
        <h4 className="headers__title">{translate("headers.title")}</h4>
        <table className="headers">
          <thead>
            <tr className="header-row">
              <th className="header-col">{translate("headers.name")}</th>
              <th className="header-col">{translate("headers.description")}</th>
              <th className="header-col">{translate("headers.type")}</th>
            </tr>
          </thead>
          <tbody>
          {
            headers.entrySeq().map( ([ key, header ]) => {
              if(!Im.Map.isMap(header)) {
                return null
              }

              const description = header.get("description")
              const type = header.getIn(["schema"]) ? header.getIn(["schema", "type"]) : header.getIn(["type"])
              const schemaExample = header.getIn(["schema", "example"])

              return (<tr key={ key }>
                <td className="header-col">{ key }</td>
                <td className="header-col">{
                  !description ? null : <Markdown source={ description } />
                }</td>
                <td className="header-col">{ type } { schemaExample ? <Property propKey={ "Example" } propVal={ schemaExample } propStyle={ propStyle } /> : null }</td>
              </tr>)
            }).toArray()
          }
          </tbody>
        </table>
      </div>
    )
  }
}
