/**
 * @prettier
 */
import PropTypes from "prop-types"

export const objectSchema = PropTypes.object

export const booleanSchema = PropTypes.bool

export const schema = PropTypes.oneOfType([objectSchema, booleanSchema])
