import React from "react"
import Im, { OrderedMap } from "immutable"
import { OAS3ComponentWrapFactory } from "../helpers"

const mapRequestBody = (iterable, fn) => iterable.entries().filter(Im.Map.isMap).map((val) => {
  return fn(val.get(0), val.get(1))
})

export default OAS3ComponentWrapFactory((props) => {
  const { Ori, operation, getComponent, specSelectors } = props

  const Model = getComponent("model")

  const requestBody = operation.get("requestBody")
  const requestBodyDescription = (requestBody && requestBody.get("description")) || null
  const requestBodyContent = (requestBody && requestBody.get("content")) || new OrderedMap()
  return <div>
    <Ori {...props}></Ori>
    {
      requestBody &&
      <div className="opblock-section">
        <div className="opblock-section-header">
          <h4 className="opblock-title">Request body</h4>
        </div>
        <div className="opblock-description-wrapper">
          { requestBodyDescription &&
            <p>{requestBodyDescription}</p>
          }
          { !requestBodyContent.count() ? <p>No content</p> :
            requestBodyContent.map((mediaTypeValue, key) => (
              <div>
                <h4>{key}</h4>
                <Model
                  getComponent={ getComponent }
                  specSelectors={ specSelectors }
                  expandDepth={1}
                  schema={mediaTypeValue.get("schema")} />
              </div>
            )).toArray()
          }
        </div>
      </div>
    }
  </div>
})
