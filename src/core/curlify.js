import win from "./window"
import { Map } from "immutable"

/**
 * if duplicate key name existed from FormData entries,
 * we mutated the key name by appending a hashIdx
 * @param {String} k - possibly mutated key name
 * @return {String} - src key name
 */
const extractKey = (k) => {
  const hashIdx = "_**[]"
  if (k.indexOf(hashIdx) < 0) {
    return k
  }
  return k.split(hashIdx)[0].trim()
}

export default function curl( request ){
  let curlified = []
  let isMultipartFormDataRequest = false
  let headers = request.get("headers")
  curlified.push( "curl" )

  if (request.get("curlOptions")) {
    curlified.push(...request.get("curlOptions"))
  }

  curlified.push( "-X", request.get("method") )
  curlified.push( `"${request.get("url")}"`)

  if ( headers && headers.size ) {
    for( let p of request.get("headers").entries() ){
      let [ h,v ] = p
      curlified.push( "-H " )
      curlified.push( `"${h}: ${v.replace(/\$/g, "\\$")}"` )
      isMultipartFormDataRequest = isMultipartFormDataRequest || /^content-type$/i.test(h) && /^multipart\/form-data$/i.test(v)
    }
  }

  if ( request.get("body") ){
    if (isMultipartFormDataRequest && ["POST", "PUT", "PATCH"].includes(request.get("method"))) {
      for( let [ k,v ] of request.get("body").entrySeq()) {
        let extractedKey = extractKey(k)
        curlified.push( "-F" )
        if (v instanceof win.File) {
          curlified.push(`"${extractedKey}=@${v.name}${v.type ? `;type=${v.type}` : ""}"` )
        } else {
          curlified.push(`"${extractedKey}=${v}"` )
        }
      }
    } else {
      curlified.push( "-d" )
      let reqBody = request.get("body")
      if (!Map.isMap(reqBody)) {
        curlified.push( JSON.stringify( request.get("body") ).replace(/\\n/g, "").replace(/\$/g, "\\$") )
      } else {
        let curlifyToJoin = []
        for (let [k, v] of request.get("body").entrySeq()) {
          let extractedKey = extractKey(k)
          if (v instanceof win.File) {
            curlifyToJoin.push(`"${extractedKey}":{"name":"${v.name}"${v.type ? `,"type":"${v.type}"` : ""}}`)
          } else {
            curlifyToJoin.push(`"${extractedKey}":${JSON.stringify(v).replace(/\\n/g, "").replace("$", "\\$")}`)
          }
        }
        curlified.push(`{${curlifyToJoin.join()}}`)
      }
    }
  } else if(!request.get("body") && request.get("method") === "POST") {
    curlified.push( "-d" )
    curlified.push( "\"\"" )
  }

  return curlified.join( " " )
}
