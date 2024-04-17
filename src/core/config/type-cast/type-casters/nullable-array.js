/**
 * @prettier
 */
const nullableArrayTypeCaster = (value) => (Array.isArray(value) ? value : null)

export default nullableArrayTypeCaster
