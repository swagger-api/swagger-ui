import { pascalCaseFilename } from "core/utils"

const request = require.context(".", true, /\.jsx?$/)

const allPlugins = {}

request.keys().forEach( function( key ){
  if( key === "./index.js" ) {
    return
  }

  // if( key.slice(2).indexOf("/") > -1) {
  //   // skip files in subdirs
  //   return
  // }

  let mod = request(key)
  allPlugins[pascalCaseFilename(key)] = mod.default ? mod.default : mod
})

export default allPlugins
