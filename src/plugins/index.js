import { pascalCaseFilename } from "js/utils"

const request = require.context(".", true, /\.jsx?$/)

request.keys().forEach( function( key ){
  if( key === "./index.js" ) {
    return
  }

  // if( key.slice(2).indexOf("/") > -1) {
  //   // skip files in subdirs
  //   return
  // }

  let mod = request(key)
  module.exports[pascalCaseFilename(key)] = mod.default ? mod.default : mod
})
