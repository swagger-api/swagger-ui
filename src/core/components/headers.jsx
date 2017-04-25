import React, { PropTypes } from "react"
import Im from "immutable"

export default class Headers extends React.Component {

  static propTypes = {
    headers: PropTypes.object.isRequired
  };

  render() {

    let { headers } = this.props

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
              return (<tr key={ key }>
                <td className="header-col">{ key }</td>
                <td className="header-col">{ header.get( "description" ) }</td>
                <td className="header-col">{ header.get( "type" ) }</td>
              </tr>)
            }).toArray()
          }
          </tbody>
        </table>
      </div>
    )
  }
}
