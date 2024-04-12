/**
 * @prettier
 */
import randomBytes from "randombytes"
import RandExp from "randexp"
import optionAPI from "../api/optionAPI"

/**
 * Most of the functions return constants by default unless randomness option is enabled.
 * This is due to the nature of SwaggerUI expectations - provide as stable data as possible.
 *
 */
export const randInt = (min, max) => min + Math.floor(optionAPI("random")() * (1 + (max - min)))

export const bytes = (length) => randomBytes(length)

export const randexp = (pattern) => {
  try {
    RandExp.prototype.max = optionAPI("maxRandExp")
    RandExp.prototype.randInt = randInt

    const randexpInstance = new RandExp(pattern)
    return randexpInstance.gen()
  } catch {
    // invalid regex should not cause a crash (regex syntax varies across languages)
    return "string"
  }
}

export const pick = (list) => optionAPI("randomEnabled") ? list[Math.floor(optionAPI("random")() * list.length)] : list.at(0)

export const string = () => optionAPI("randomEnabled") ? randexp(`[a-z]{${optionAPI("minLen")},${optionAPI("maxLen")}}`) : "string"

export const integer = () => optionAPI("randomEnabled") ? randInt(optionAPI("minInt"), optionAPI("maxInt")) : 0

export const number = () => integer()

export const boolean = () => optionAPI("randomEnabled") ? optionAPI("random")() > 0.5 : true

export const date = () => {
  if (!optionAPI("randomEnabled")) {
    return new Date()
  }

  let earliest = new Date(optionAPI("minDateTime"))
  let latest = new Date(optionAPI("maxDateTime"))

  return new Date(randInt(earliest.getTime(), latest.getTime()))
}