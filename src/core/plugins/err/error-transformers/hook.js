import reduce from "lodash/reduce"
import * as NotOfType from "./transformers/not-of-type"
import * as ParameterOneOf from "./transformers/parameter-oneof"

const errorTransformers = [
  NotOfType,
  ParameterOneOf
]

export default function transformErrors (errors) {
  // Dev note: unimplemented artifact where
  // jsSpec: system.specSelectors.specJson().toJS()
  // regardless, to be compliant with redux@4, instead of calling the store method here,
  // jsSpec should be pass down as an argument,
  let inputs = {
    jsSpec: {}
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
