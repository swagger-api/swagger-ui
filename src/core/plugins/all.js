import { pascalCaseFilename } from "core/utils"
import SafeRender from "core/plugins/safe-render"

const request = require.context(".", true, /\.jsx?$/)

const allPlugins = {}

export default allPlugins

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

allPlugins.SafeRender = SafeRender
