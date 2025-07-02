/**
 * @prettier
 */
import randomBytes from "randombytes"
import RandExp from "randexp"

/**
 * Some of the functions returns constants. This is due to the nature
 * of SwaggerUI expectations - provide as stable data as possible.
 *
 * In future, we may decide to randomize these function and provide
 * true random values.
 */

export const bytes = (length) => randomBytes(length)

export const randexp = (pattern) => {
  try {
    /**
     * Applying maximum value (100) to numbers from regex patterns to avoid ReDoS:
     * 1. {x}
     * 2. {x,}
     * 3. {,y}
     * 4. {x,y}
     */
    const patternSanitizer =
      /(?<=(?<!\\)\{)(\d{3,})(?=\})|(?<=(?<!\\)\{\d*,)(\d{3,})(?=\})|(?<=(?<!\\)\{)(\d{3,})(?=,\d*\})/g
    const safePattern = pattern.replace(patternSanitizer, "100")
    const randexpInstance = new RandExp(safePattern)
    randexpInstance.max = 100
    return randexpInstance.gen()
  } catch {
    // invalid regex should not cause a crash (regex syntax varies across languages)
    return "string"
  }
}

export const pick = (list) => {
  return list.at(0)
}

export const string = () => "string"

export const number = () => 0

export const integer = () => 0
