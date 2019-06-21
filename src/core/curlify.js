import win from "./window"
import { atob } from "core/utils"

export default function curl( request ){
  let curlified = []
  let type = ""
  let headers = request.get("headers")
  curlified.push( "curl" )
  curlified.push( "-X", request.get("method") )
  curlified.push( `"${request.get("url")}"`)


  function getBasicAuthUser(authHeader) {
    if (authHeader.startsWith("Basic ")) {
      let b64Decoded = atob(authHeader.substr(6))
      let colonIdx = b64Decoded.indexOf(":")
      if (colonIdx < 0) {
        return undefined
      }
      return b64Decoded.substr(0, colonIdx)
    }
  }

  let user = ""
  if ( headers && headers.size ) {
    for( let p of request.get("headers").entries() ){
      let [ h,v ] = p
      if (h == "authorization") {
        user = getBasicAuthUser(v)
      }
    }
    for( let p of request.get("headers").entries() ){
      let [ h,v ] = p
      type = v
      if (h == "authorization" && user) {
        curlified.push("-u", user)
      } else {
        curlified.push( "-H " )
        curlified.push( `"${h}: ${v}"` )
      }
    }
  }

  if ( request.get("body") ){

    if(type === "multipart/form-data" && request.get("method") === "POST") {
      for( let [ k,v ] of request.get("body").entrySeq()) {
        curlified.push( "-F" )
        if (v instanceof win.File) {
          curlified.push( `"${k}=@${v.name}${v.type ? `;type=${v.type}` : ""}"` )
        } else {
          curlified.push( `"${k}=${v}"` )
        }
      }
    } else {
      curlified.push( "-d" )
      curlified.push( JSON.stringify( request.get("body") ).replace(/\\n/g, "") )
    }
  }

  return curlified.join( " " )
}
