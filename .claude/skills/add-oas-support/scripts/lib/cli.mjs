/**
 * @prettier
 */
import { parseArgs } from "node:util"

/**
 * parseArgs wrapper shared by the scripts: `--help`/`-h` prints the usage text and exits 0;
 * unknown options, missing values or a failed `validate` print the usage text and exit 2.
 */
export const parseCli = (
  usage,
  { options = {}, allowPositionals = false, validate } = {}
) => {
  const fail = (message) => {
    if (message) console.error(`error: ${message}\n`)
    console.error(usage.trim())
    process.exit(2)
  }
  let parsed
  try {
    parsed = parseArgs({
      allowPositionals,
      options: {
        ...options,
        help: { type: "boolean", short: "h", default: false },
      },
    })
  } catch (error) {
    fail(error.message)
  }
  if (parsed.values.help) {
    console.log(usage.trim())
    process.exit(0)
  }
  const problem = validate?.(parsed)
  if (problem) fail(problem === true ? undefined : problem)
  return parsed
}
