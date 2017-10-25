import reduce from "lodash/reduce"
let request = require.context("./transformers/", true, /\.js$/)
let errorTransformers = []

request.keys().forEach( function( key ){
  if( key === "./hook.js" ) {
    return
  }

  if( !key.match(/js$/) ) {
    return
  }

  if( key.slice(2).indexOf("/") > -1) {
    // skip files in subdirs
    return
  }

  errorTransformers.push({
    name: toTitleCase(key).replace(".js", "").replace("./", ""),
    transform: request(key).transform
  })
})

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

function toTitleCase(str) {
  return str
    .split("-")
    .map(substr => substr[0].toUpperCase() + substr.slice(1))
    .join("")
}
