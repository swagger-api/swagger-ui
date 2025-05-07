/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

const OpenAPIExtensions = ({
  openAPISpecObj,
  getSystem,
  openAPIExtensions,
}) => {
  const { fn } = getSystem()
  const { useComponent } = fn.jsonSchema202012

  const JSONViewer = useComponent("JSONViewer")
  return openAPIExtensions.map((keyword) => (
    <JSONViewer
      key={keyword}
      name={keyword}
      value={openAPISpecObj[keyword]}
      className="json-schema-2020-12-json-viewer-extension-keyword"
    />
  ))
}

OpenAPIExtensions.propTypes = {
  openAPISpecObj: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
    .isRequired,
  getSystem: PropTypes.func.isRequired,
  openAPIExtensions: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default OpenAPIExtensions
