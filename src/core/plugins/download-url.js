/* global Promise */

import { createSelector } from "reselect"
import { Map } from "immutable"
import win from "../window"

export default function downloadUrlPlugin (toolbox) {
  let { fn } = toolbox

  const actions = {
    download: (url)=> ({ errActions, specSelectors, specActions, getConfigs }) => {
      let { fetch } = fn
      const config = getConfigs()
      url = url || specSelectors.url()
      specActions.updateLoadingStatus("loading")
      errActions.clear({source: "fetch"})
      fetch({
        url,
        loadSpec: true,
        requestInterceptor: config.requestInterceptor || (a => a),
        responseInterceptor: config.responseInterceptor || (a => a),
        credentials: "same-origin",
        headers: {
          "Accept": "application/json,*/*"
        }
      }).then(next,next)

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
