import { createSelector } from "reselect"
import { Map } from "immutable"
import win from "../window"
import { applySecurities as applySecurities3 } from "swagger-client/lib/execute/oas3/build-request"
import { applySecurities as applySecurities2  } from "swagger-client/lib/execute/swagger2/build-request"
import { isOAS3 } from "swagger-client/es/helpers"

export default function downloadUrlPlugin (toolbox) {
  let { fn } = toolbox

  const actions = {
    download: (url)=> ({ errActions, specSelectors, specActions, getConfigs, authSelectors}) => {
      let { fetch } = fn
      const config = getConfigs()
      url = url || specSelectors.url()
      specActions.updateLoadingStatus("loading")
      errActions.clear({source: "fetch"})
      let request = {
        url,
        loadSpec: true,
        requestInterceptor: config.requestInterceptor || (a => a),
        responseInterceptor: config.responseInterceptor || (a => a),
        credentials: "same-origin",
        headers: {
          "Accept": "application/json,*/*"
        }
      }
      let reFetch = false
      if(config.reFetchSchemaOnAuthChanged) {
        const spec = specSelectors.specJsonWithResolvedSubtrees().toJS()
        const authorized = authSelectors.authorized() && authSelectors.authorized().toJS()
        if(spec && Object.keys(spec).length > 0) {
          let securities = {
            authorized,
            definitions: specSelectors.securityDefinitions() && specSelectors.securityDefinitions().toJS(),
            specSecurity:  specSelectors.security() && specSelectors.security().toJS()
          }
          const operation = {
            security: Object.keys(securities.authorized).map(key => ({[key]: []}))
          }
          try {
            if(isOAS3(spec)) {
              applySecurities3({
                request,
                securities,
                operation,
                spec,
              })
            }
            else {
              applySecurities2({
                request,
                securities,
                operation,
                spec
              })
            }
          }
          catch (ex) {
            console.error(ex)
          }
        }
        else {
          if(authorized && Object.keys(authorized).length > 0) {
            reFetch = true
          }
        }
      }
      fetch(request).then(next,next)

      function next(res) {
        if(res instanceof Error || res.status >= 400) {
          specActions.updateLoadingStatus("failed")
          errActions.newThrownErr(Object.assign( new Error((res.message || res.statusText) + " " + url), {source: "fetch"}))
          // Check if the failure was possibly due to CORS or mixed content
          if (!res.status && res instanceof Error) checkPossibleFailReasons()
          return
        }
        specActions.updateLoadingStatus("success")
        specActions.updateSpec(res.text)
        if(specSelectors.url() !== url) {
          specActions.updateUrl(url)
        }
        if(reFetch) {
          specActions.download()
        }
      }

      function checkPossibleFailReasons() {
        try {
          let specUrl

          if("URL" in win ) {
            specUrl = new URL(url)
          } else {
            // legacy browser, use <a href> to parse the URL
            specUrl = document.createElement("a")
            specUrl.href = url
          }

          if(specUrl.protocol !== "https:" && win.location.protocol === "https:") {
            const error = Object.assign(
              new Error(`Possible mixed-content issue? The page was loaded over https:// but a ${specUrl.protocol}// URL was specified. Check that you are not attempting to load mixed content.`),
              {source: "fetch"}
            )
            errActions.newThrownErr(error)
            return
          }
          if(specUrl.origin !== win.location.origin) {
            const error = Object.assign(
              new Error(`Possible cross-origin (CORS) issue? The URL origin (${specUrl.origin}) does not match the page (${win.location.origin}). Check the server returns the correct 'Access-Control-Allow-*' headers.`),
              {source: "fetch"}
            )
            errActions.newThrownErr(error)
          }
        } catch (e) {
          return
        }
      }

    },

    updateLoadingStatus: (status) => {
      let enums = [null, "loading", "failed", "success", "failedConfig"]
      if(enums.indexOf(status) === -1) {
        console.error(`Error: ${status} is not one of ${JSON.stringify(enums)}`)
      }

      return {
        type: "spec_update_loading_status",
        payload: status
      }
    }
  }

  let reducers = {
    "spec_update_loading_status": (state, action) => {
      return (typeof action.payload === "string")
        ? state.set("loadingStatus", action.payload)
        : state
    }
  }

  let selectors = {
    loadingStatus: createSelector(
      state => {
        return state || Map()
      },
      spec => spec.get("loadingStatus") || null
    )
  }

  return {
    statePlugins: {
      spec: { actions, reducers, selectors }
    }
  }
}
