import React from "react"
import PropTypes from "prop-types"
import Im from "immutable"
//OutSystems change - import stringify
import { stringify } from "core/utils"
//OutSystems change - import a function created by OutSystems to get the data type
import { getPrimitiveModel } from "./dataTypesOutSystems"


const propClass = "header-example"

export default class Headers extends React.Component {
  static propTypes = {
    headers: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    //OutSystems add a new propType, which will be used to pass as input of the HighlightCode component
    getConfigs: PropTypes.func.isRequired
  };

  render() {
    //OutSystems change - pass the getConfigs property to the render method
    const { headers, getComponent, getConfigs } = this.props

    const Property = getComponent("Property")
    const Markdown = getComponent("Markdown", true)
    //OutSystems change - get the HighlightCode component
    const HighlightCode = getComponent("highlightCode")

    if ( !headers || !headers.size )
      return null

    return (
       //OutSystems change - remove the class of the div 
      <div>
        <h4 className="headers__title">Headers:</h4>
        {/* OutSystems change - change the branding of the table */} 
        <table aria-live="polite" className="responses-table"  role="region">
          <thead>
            <tr>
                {/* OutSystems change - change the branding of the table - Add the Example column */} 
                <th className="col_header parameters-col_name">Name</th>
                <th className="col_header parameters-col_description">Description</th>
                <th className="col_header parameters-col_name">Type</th>
                <th className="col_header parameters-col_name">Example</th>
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
              //const schemaExample = header.getIn(["schema", "example"])
              //OutSystems change - get the format property
              const format = header.getIn(["schema"]) ? header.getIn(["schema", "format"]) : header.getIn(["format"])
              //OutSystems change - get the dataType to be displayed according to the type and format
              const dataType = getPrimitiveModel(type, format)
               //OutSystems change - get the example property
              const example = header.getIn(["example"]) ?? header.getIn(["x-example"]);

              return (<tr key={key}>
                {/* OutSystems change - branding of the table*/}
                <td className="col_header parameters-col_name">{ key }</td>
                <td className="col_header parameters-col_description">{
                  !description ? null : <Markdown source={ description } />
                }</td>
                {/* OutSystems change - display the dataType got from the function getPrimitiveModel
                <td className="header-col">{type} {schemaExample ? <Property propKey={"Example"} propVal={schemaExample} propClass={propClass} /> : null}</td> */}
                <td className="col_header parameters-col_name">{dataType} </td>
                {/* OutSystems change - display the example */}
                <td className="col_header parameters-col_name">
                  <HighlightCode
                    key={key}
                    className="body-param__example"
                    getConfigs={getConfigs}
                    language={null}
                    value={stringify(example)}
                  />
                </td>
              </tr>)
            }).toArray()
          }
          </tbody>
        </table>
      </div>
    )
  }
}
