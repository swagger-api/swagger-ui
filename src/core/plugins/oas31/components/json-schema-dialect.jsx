/**
 * @prettier
 */

import React from "react"
import PropTypes from "prop-types"

import { sanitizeUrl } from "core/utils/url"

const JsonSchemaDialect = ({ getComponent, specSelectors }) => {
  const jsonSchemaDialect = specSelectors.selectJsonSchemaDialectField()
  const jsonSchemaDialectDefault = specSelectors.selectJsonSchemaDialectDefault() // prettier-ignore

  const Link = getComponent("Link")

  return (
    <>
      {jsonSchemaDialect && jsonSchemaDialect === jsonSchemaDialectDefault && (
        <p className="info__jsonschemadialect">
          JSON Schema dialect:{" "}
          <Link target="_blank" href={sanitizeUrl(jsonSchemaDialect)}>
            {jsonSchemaDialect}
          </Link>
        </p>
      )}

      {jsonSchemaDialect && jsonSchemaDialect !== jsonSchemaDialectDefault && (
        <div className="error-wrapper">
          <div className="no-margin">
            <div className="errors">
              <div className="errors-wrapper">
                <h4 className="center">Warning</h4>
                <p className="message">
                  <strong>OpenAPI.jsonSchemaDialect</strong> field contains a
                  value different from the default value of{" "}
                  <Link target="_blank" href={jsonSchemaDialectDefault}>
                    {jsonSchemaDialectDefault}
                  </Link>
                  . Values different from the default one are currently not
                  supported. Please either omit the field or provide it with the
                  default value.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

JsonSchemaDialect.propTypes = {
  getComponent: PropTypes.func.isRequired,
  specSelectors: PropTypes.shape({
    selectJsonSchemaDialectField: PropTypes.func.isRequired,
    selectJsonSchemaDialectDefault: PropTypes.func.isRequired,
  }).isRequired,
}

export default JsonSchemaDialect
