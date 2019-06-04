import curl from "core/curlify"
import Swagger from "swagger-client"
import Im from "immutable"

export const buildCurl = options => {
  let request = Im.fromJS(Swagger.buildRequest(options))
  return curl(request)
}

export const curlify = request => {
  let req = Im.fromJS(request)
  return curl(req)
}
