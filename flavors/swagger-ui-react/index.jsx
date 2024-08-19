/**
 * @prettier
 */
"use client"

import React, { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import SwaggerUIConstructor from "#swagger-ui"

const { config } = SwaggerUIConstructor

const usePrevious = (value) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

const SwaggerUI = ({
  spec = config.defaults.spec,
  url = config.defaults.url,
  layout = config.defaults.layout,
  requestInterceptor = config.defaults.requestInterceptor,
  responseInterceptor = config.defaults.responseInterceptor,
  supportedSubmitMethods = config.defaults.supportedSubmitMethods,
  queryConfigEnabled = config.defaults.queryConfigEnabled,
  plugins = config.defaults.plugins,
  displayOperationId = config.defaults.displayOperationId,
  showMutatedRequest = config.defaults.showMutatedRequest,
  docExpansion = config.defaults.docExpansion,
  defaultModelExpandDepth = config.defaults.defaultModelExpandDepth,
  defaultModelsExpandDepth = config.defaults.defaultModelsExpandDepth,
  defaultModelRendering = config.defaults.defaultModelRendering,
  presets = config.defaults.presets,
  deepLinking = config.defaults.deepLinking,
  showExtensions = config.defaults.showExtensions,
  showCommonExtensions = config.defaults.showCommonExtensions,
  filter = config.defaults.filter,
  requestSnippetsEnabled = config.defaults.requestSnippetsEnabled,
  requestSnippets = config.defaults.requestSnippets,
  tryItOutEnabled = config.defaults.tryItOutEnabled,
  displayRequestDuration = config.defaults.displayRequestDuration,
  withCredentials = config.defaults.withCredentials,
  persistAuthorization = config.defaults.persistAuthorization,
  oauth2RedirectUrl = config.defaults.oauth2RedirectUrl,
  onComplete = null,
}) => {
  const [system, setSystem] = useState(null)
  const SwaggerUIComponent = system?.getComponent("App", "root")
  const prevSpec = usePrevious(spec)
  const prevUrl = usePrevious(url)

  useEffect(() => {
    const systemInstance = SwaggerUIConstructor({
      plugins,
      spec,
      url,
      layout,
      defaultModelsExpandDepth,
      defaultModelRendering,
      presets: [SwaggerUIConstructor.presets.apis, ...presets],
      requestInterceptor,
      responseInterceptor,
      onComplete: () => {
        if (typeof onComplete === "function") {
          onComplete(systemInstance)
        }
      },
      docExpansion,
      supportedSubmitMethods,
      queryConfigEnabled,
      defaultModelExpandDepth,
      displayOperationId,
      tryItOutEnabled,
      displayRequestDuration,
      requestSnippetsEnabled,
      requestSnippets,
      showMutatedRequest,
      deepLinking,
      showExtensions,
      showCommonExtensions,
      filter,
      persistAuthorization,
      withCredentials,
      ...(typeof oauth2RedirectUrl === "string"
        ? { oauth2RedirectUrl: oauth2RedirectUrl }
        : {}),
    })

    setSystem(systemInstance)
  }, [])

  useEffect(() => {
    if (system) {
      const prevStateUrl = system.specSelectors.url()
      if (url !== prevStateUrl || url !== prevUrl) {
        system.specActions.updateSpec("")
        if (url) {
          system.specActions.updateUrl(url)
          system.specActions.download(url)
        }
      }
    }
  }, [system, url])

  useEffect(() => {
    if (system) {
      const prevStateSpec = system.specSelectors.specStr()
      if (
        spec &&
        spec !== SwaggerUIConstructor.config.defaults.spec &&
        (spec !== prevStateSpec || spec !== prevSpec)
      ) {
        const updatedSpec =
          typeof spec === "object" ? JSON.stringify(spec) : spec
        system.specActions.updateSpec(updatedSpec)
      }
    }
  }, [system, spec])

  return SwaggerUIComponent ? <SwaggerUIComponent /> : null
}

SwaggerUI.propTypes = {
  spec: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  url: PropTypes.string,
  layout: PropTypes.string,
  requestInterceptor: PropTypes.func,
  responseInterceptor: PropTypes.func,
  onComplete: PropTypes.func,
  docExpansion: PropTypes.oneOf(["list", "full", "none"]),
  supportedSubmitMethods: PropTypes.arrayOf(
    PropTypes.oneOf([
      "get",
      "put",
      "post",
      "delete",
      "options",
      "head",
      "patch",
      "trace",
    ])
  ),
  queryConfigEnabled: PropTypes.bool,
  plugins: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.arrayOf(PropTypes.func),
    PropTypes.func,
  ]),
  displayOperationId: PropTypes.bool,
  showMutatedRequest: PropTypes.bool,
  defaultModelExpandDepth: PropTypes.number,
  defaultModelsExpandDepth: PropTypes.number,
  defaultModelRendering: PropTypes.oneOf(["example", "model"]),
  presets: PropTypes.arrayOf(PropTypes.func),
  deepLinking: PropTypes.bool,
  showExtensions: PropTypes.bool,
  showCommonExtensions: PropTypes.bool,
  filter: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  requestSnippetsEnabled: PropTypes.bool,
  requestSnippets: PropTypes.object,
  tryItOutEnabled: PropTypes.bool,
  displayRequestDuration: PropTypes.bool,
  persistAuthorization: PropTypes.bool,
  withCredentials: PropTypes.bool,
  oauth2RedirectUrl: PropTypes.string,
}
SwaggerUI.System = SwaggerUIConstructor.System
SwaggerUI.presets = SwaggerUIConstructor.presets
SwaggerUI.plugins = SwaggerUIConstructor.plugins
SwaggerUI.config = SwaggerUIConstructor.config

export default SwaggerUI
