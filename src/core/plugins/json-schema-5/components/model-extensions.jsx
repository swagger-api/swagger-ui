/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"
import { immutableToJS } from "core/utils"
import ImPropTypes from "react-immutable-proptypes"

export const ModelExtensions = ({ extensions, propClass = "" }) => {
  return extensions
    .entrySeq()
    .map(([key, value]) => {
      const normalizedValue = immutableToJS(value) ?? null

      return (
        <tr key={key} className={propClass}>
          <td>{key}</td>
          <td>{JSON.stringify(normalizedValue)}</td>
        </tr>
      )
    })
    .toArray()
}

ModelExtensions.propTypes = {
  extensions: ImPropTypes.map.isRequired,
  propClass: PropTypes.string,
}
