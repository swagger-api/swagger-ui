import memoize from "lodash/memoize"

/**
 * This function is extension on top of lodash.memoize.
 * It uses all the arguments of the `fn` as the cache key instead of just the first one.
 * If resolver is provided, it determines the cache key for
 * storing the result based on the arguments provided to the memoized function.
 */

const shallowArrayEquals = (a) => (b) => {
  return Array.isArray(a) && Array.isArray(b)
    && a.length === b.length
    && a.every((val, index) => val === b[index])
}

const list = (...args) => args

class Cache extends Map {
  delete(key) {
    const keys = Array.from(this.keys())
    const foundKey = keys.find(shallowArrayEquals(key))
    return super.delete(foundKey)
  }

  get(key) {
    const keys = Array.from(this.keys())
    const foundKey = keys.find(shallowArrayEquals(key))
    return super.get(foundKey)
  }

  has(key) {
    const keys = Array.from(this.keys())
    return keys.findIndex(shallowArrayEquals(key)) !== -1
  }
}

const memoizeN = (fn, resolver = list) => {
  const { Cache: OriginalCache } = memoize
  memoize.Cache = Cache

  const memoized = memoize(fn, resolver)

  memoize.Cache = OriginalCache

  return memoized
}

export default memoizeN
