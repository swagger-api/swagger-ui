import React from "react"
import PropTypes from "prop-types"
import Im from "immutable"

const propClass = "header-example"

export default class Headers extends React.Component {
  static propTypes = {
    headers: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired
  }

  render() {
    let { headers, getComponent } = this.props

    const Property = getComponent("Property")
    const Markdown = getComponent("Markdown", true)

    if ( !headers || !headers.size )
      return null

      return (
      <div className="headers-wrapper">
        <h4 className="headers__title">Headers:</h4>
        <table className="headers">
          <thead>
            <tr className="header-row">
              <th className="header-col">Name</th>
              <th className="header-col">Description</th>
              <th className="header-col">Type</th>
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
                <td className="header-col">{ type } { schemaExample ? <Property propKey={ "Example" } propVal={ schemaExample } propClass={ propClass } /> : null }</td>
              </tr>)
            }).toArray()
          }
          </tbody>
        </table>
      </div>
    )
  }
}
