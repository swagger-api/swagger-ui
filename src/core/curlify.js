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
      let formDataBody = request.get("body").split("&")

      for(var data in formDataBody) {
        curlified.push( "-F" )
        curlified.push(formDataBody[data])
      }
    } else {
      curlified.push( "-d" )
      curlified.push( JSON.stringify( request.get("body") ).replace(/\\n/g, "") )
    }
  }

  return curlified.join( " " )
}
