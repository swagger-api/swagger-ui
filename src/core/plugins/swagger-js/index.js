import Swagger from "swagger-client"

const createExecutor = (origExecutor) => (opts) => {
  const origRequestInterceptor = opts.requestInterceptor

  const newOpts = {
    ...opts,
    requestInterceptor: (req) => {
      let request = origRequestInterceptor ? origRequestInterceptor(req) : req
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
      return request
    }
  }
  return origExecutor(newOpts)
}

module.exports = function({ configs }) {
  return {
    fn: {
      fetch: Swagger.makeHttp(createPreFetch(configs.preFetch), configs.postFetch),
      buildRequest: createBuildRequest(Swagger.buildRequest),
      execute: createExecutor(Swagger.execute),
      resolve: Swagger.resolve,
      serializeRes: Swagger.serializeRes,
      opId: Swagger.helpers.opId
    }
  }
}
