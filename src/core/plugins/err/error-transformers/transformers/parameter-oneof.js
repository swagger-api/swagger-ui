import get from "lodash/get"
import { fromJS } from "immutable"

export function transform(errors, { jsSpec }) {
  // LOOK HERE THIS TRANSFORMER IS CURRENTLY DISABLED 😃
  // TODO: finish implementing, fix flattening problem
  /* eslint-disable no-unreachable */
  return errors


  // JSONSchema gives us very little to go on
  let searchStr = "is not exactly one from <#/definitions/parameter>,<#/definitions/jsonReference>"
  return errors
    .map(err => {
      let message = err.get("message")
      let isParameterOneOfError = message.indexOf(searchStr) > -1
      if(isParameterOneOfError) {
        // try to find what's wrong
        return createTailoredParameterError(err, jsSpec)
      } else {
        return err
      }
    })
    .flatten(true) // shallow Immutable flatten
}

const VALID_IN_VALUES = ["path", "query", "header", "body", "formData"]
const VALID_COLLECTIONFORMAT_VALUES = ["csv", "ssv", "tsv", "pipes", "multi"]

function createTailoredParameterError(err, jsSpec) {
  let newErrs = []
  let parameter = get(jsSpec, err.get("path"))

  // find addressable cases
  if(parameter.in && VALID_IN_VALUES.indexOf(parameter.in) === -1) {
    let message = `Wrong value for the "in" keyword. Expected one of: ${VALID_IN_VALUES.join(", ")}.`
    newErrs.push({
      message,
      path: err.get("path") + ".in",
      type: "spec",
      source: "structural",
      level: "error"
    })
  }

  if(parameter.collectionFormat && VALID_COLLECTIONFORMAT_VALUES.indexOf(parameter.collectionFormat) === -1) {
    let message = `Wrong value for the "collectionFormat" keyword. Expected one of: ${VALID_COLLECTIONFORMAT_VALUES.join(", ")}.`
    newErrs.push({
      message,
      path: err.get("path") + ".collectionFormat",
      type: "spec",
      source: "structural",
      level: "error"
    })
  }

  return newErrs.length ? fromJS(newErrs) : err // fall back to making no changes

}
