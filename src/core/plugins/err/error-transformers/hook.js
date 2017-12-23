import reduce from "lodash/reduce"
import * as NotOfType from "./transformers/not-of-type"
import * as ParameterOneOf from "./transformers/parameter-oneof"
import * as StripInstance from "./transformers/strip-instance"

const errorTransformers = [
  NotOfType,
  ParameterOneOf,
  StripInstance
]

export default function transformErrors (errors, system) {
  let inputs = {
    jsSpec: system.specSelectors.specJson().toJS()
  }

  let transformedErrors = reduce(errorTransformers, (result, transformer) => {
    try {
      let newlyTransformedErrors = transformer.transform(result, inputs)
      return newlyTransformedErrors.filter(err => !!err) // filter removed errors
    } catch(e) {
      console.error("Transformer error:", e)
      return result
    }
  }, errors)

  return transformedErrors
    .filter(err => !!err) // filter removed errors
    .map(err => {
      if(!err.get("line") && err.get("path")) {
        // TODO: re-resolve line number if we've transformed it away
      }
      return err
    })

}
