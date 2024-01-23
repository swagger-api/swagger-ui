import Swagger from "swagger-client"

const createPreFetch = (origPreFetch) => (req) => {
  let request = origPreFetch(req)

  // never send cookie
  if(typeof request === "string") {
    request = {
      url: req,
      credentials: "omit"
    }
  }else {
    request = {
      ...req,
      credentials: "omit"
    }
  }
  return req
}

module.exports = function({ configs }) {
  return {
    fn: {
      fetch: Swagger.makeHttp(createPreFetch(configs.preFetch), configs.postFetch),
      buildRequest: Swagger.buildRequest,
      execute: Swagger.execute,
      resolve: Swagger.resolve,
      serializeRes: Swagger.serializeRes,
      opId: Swagger.helpers.opId
    }
  }
}
