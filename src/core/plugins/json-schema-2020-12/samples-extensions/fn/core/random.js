/**
 * @prettier
 */
import randomBytes from "randombytes"
import RandExp from "randexp"
export const bytes = (length) => randomBytes(length)

export const randexp = (pattern) => {
  try {
    const randexpInstance = new RandExp(pattern)
    return randexpInstance.gen()
  } catch {
    // invalid regex should not cause a crash (regex syntax varies across languages)
    return "string"
  }
}

export const string = () => "string"

export const number = () => 0

export const integer = () => 0
