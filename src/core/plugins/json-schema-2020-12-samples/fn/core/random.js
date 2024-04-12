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
const randomMode = () => optionAPI("mode") === "random"

const randInt = (min, max) => min + Math.floor(optionAPI("random")() * (1 + (max - min)))

export const bytes = (length) => randomBytes(length)

export const randexp = (pattern) => {
  try {
    RandExp.prototype.max = optionAPI("defaultRandExpMax")
    RandExp.prototype.randInt = randInt

    const randexpInstance = new RandExp(pattern)
    return randexpInstance.gen()
  } catch {
    // invalid regex should not cause a crash (regex syntax varies across languages)
    return "string"
  }
}

export const pick = (list) => randomMode() ? list[Math.floor(optionAPI("random")() * list.length)] : list.at(0)

export const string = () => randomMode() ? randexp(`[a-z]{${optionAPI("minLength")},${optionAPI("maxLength")}}`) : "string"

export const integer = () => randomMode() ? randInt(optionAPI("minInteger"), optionAPI("maxInteger")) : 0

export const number = () => integer()

export const boolean = () => randomMode() ? optionAPI("random")() > 0.5 : true

export const date = () => {
  if (!randomMode()) {
    return new Date()
  }

  const earliest = new Date(optionAPI("minDateTime"))
  const latest = new Date(optionAPI("maxDateTime"))

  return new Date(randInt(earliest.getTime(), latest.getTime()))
}