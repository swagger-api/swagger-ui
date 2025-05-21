/**
 * @prettier
 */

export const applyArrayConstraints = (array, constraints = {}) => {
  const { minItems, maxItems, uniqueItems } = constraints
  const { contains, minContains, maxContains } = constraints
  let constrainedArray = [...array]

  if (contains != null && typeof contains === "object") {
    if (Number.isInteger(minContains) && minContains > 1) {
      const containsItem = constrainedArray.at(0)
      for (let i = 1; i < minContains; i += 1) {
        constrainedArray.unshift(containsItem)
      }
    }
    if (Number.isInteger(maxContains) && maxContains > 0) {
      /**
       * This is noop. `minContains` already generate minimum required
       * number of items that satisfies `contains`. `maxContains` would
       * have no effect.
       */
    }
  }

  if (Number.isInteger(maxItems) && maxItems > 0) {
    constrainedArray = array.slice(0, maxItems)
  }
  if (Number.isInteger(minItems) && minItems > 0) {
    for (let i = 0; constrainedArray.length < minItems; i += 1) {
      constrainedArray.push(constrainedArray[i % constrainedArray.length])
    }
  }

  if (uniqueItems === true) {
    /**
     *  If uniqueItems is true, it implies that every item in the array must be unique.
     *  This overrides any minItems constraint that cannot be satisfied with unique items.
     *  So if minItems is greater than the number of unique items,
     *  it should be reduced to the number of unique items.
     */
    constrainedArray = Array.from(new Set(constrainedArray))
  }

  return constrainedArray
}

const arrayType = (schema, { sample = [] } = {}) => {
  return applyArrayConstraints(sample, schema)
}

export default arrayType
