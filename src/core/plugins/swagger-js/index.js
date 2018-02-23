import Swagger from "swagger-client"

module.exports = function({ configs }) {
  return {
    fn: {
      fetch: Swagger.makeHttp(configs.preFetch, configs.postFetch),
      buildRequest: Swagger.buildRequest,
      execute: Swagger.execute,
      resolve: Swagger.resolve,
      resolveSubtree: Swagger.resolveSubtree,
      serializeRes: Swagger.serializeRes,
      opId: Swagger.helpers.opId
    }
  }
}
