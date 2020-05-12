import win from "./window"

export default function curl( request ){
  let curlified = []
  let type = ""
  let headers = request.get("headers")
  curlified.push( "curl" )
  curlified.push( "-X", request.get("method") )
  curlified.push( `"${request.get("url")}"`)

  if ( headers && headers.size ) {
    for( let p of request.get("headers").entries() ){
      let [ h,v ] = p
      type = v
      curlified.push( "-H " )
      curlified.push( `"${h}: ${v}"` )
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
    } else if (type === "application/x-www-form-urlencoded" && request.get("method") === "POST") {
      curlified.push("-d")
      let formDataParams = []
      let pairs = request.get("body").split("&")
      for (let i = 0; i < pairs.length; i++) {
        if(!pairs[i])
          continue
        let pair = pairs[i].split("=")
        let k = pair[0]
        let v = pair[1]
        if (k.toLowerCase() !== "password") {
          formDataParams.push(`${k}=${v}`)
        } else {
          formDataParams.push(`${k}=******`)
        }
      }
      curlified.push(`"${formDataParams.join("&")}"`)
    } else {
      curlified.push( "-d" )
      curlified.push( JSON.stringify( request.get("body") ).replace(/\\n/g, "") )
    }
  }

  return curlified.join( " " )
}
