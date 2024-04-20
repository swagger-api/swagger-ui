/**
 * @prettier
 */
"use client"
import React, { useEffect, useCallback, useState, useRef } from "react"
import PropTypes from "prop-types"
import SwaggerUIConstructor from "#swagger-ui"

const SwaggerUI = ({
  spec = SwaggerUIConstructor.defaultOptions.url,
  url = SwaggerUIConstructor.defaultOptions.url,
  layout = SwaggerUIConstructor.defaultOptions.layout,
  requestInterceptor = SwaggerUIConstructor.defaultOptions.requestInterceptor,
  responseInterceptor = SwaggerUIConstructor.defaultOptions.responseInterceptor,
  supportedSubmitMethods = SwaggerUIConstructor.defaultOptions
    .supportedSubmitMethods,
  queryConfigEnabled = SwaggerUIConstructor.defaultOptions.queryConfigEnabled,
  plugins = SwaggerUIConstructor.defaultOptions.plugins,
  displayOperationId = SwaggerUIConstructor.defaultOptions.displayOperationId,
  showMutatedRequest = SwaggerUIConstructor.defaultOptions.showMutatedRequest,
  docExpansion = SwaggerUIConstructor.defaultOptions.docExpansion,
  defaultModelExpandDepth = SwaggerUIConstructor.defaultOptions
    .defaultModelExpandDepth,
  defaultModelsExpandDepth = SwaggerUIConstructor.defaultOptions
    .defaultModelsExpandDepth,
  defaultModelRendering = SwaggerUIConstructor.defaultOptions
    .defaultModelRendering,
  presets = SwaggerUIConstructor.defaultOptions.presets,
  deepLinking = SwaggerUIConstructor.defaultOptions.deepLinking,
  showExtensions = SwaggerUIConstructor.defaultOptions.showExtensions,
  showCommonExtensions = SwaggerUIConstructor.defaultOptions
    .showCommonExtensions,
  filter = SwaggerUIConstructor.defaultOptions.filter,
  requestSnippetsEnabled = SwaggerUIConstructor.defaultOptions
    .requestSnippetsEnabled,
  requestSnippets = SwaggerUIConstructor.defaultOptions.requestSnippets,
  tryItOutEnabled = SwaggerUIConstructor.defaultOptions.tryItOutEnabled,
  displayRequestDuration = SwaggerUIConstructor.defaultOptions
    .displayRequestDuration,
  withCredentials = SwaggerUIConstructor.defaultOptions.withCredentials,
  persistAuthorization = SwaggerUIConstructor.defaultOptions
    .persistAuthorization,
  oauth2RedirectUrl = SwaggerUIConstructor.defaultOptions.oauth2RedirectUrl,
  onComplete = null,
}) => {
  const systemRef = useRef(null)
  const SwaggerUIComponentRef = useRef(null)
  const [, forceUpdate] = useState(false)

  const handleComplete = useCallback(() => {
    if (typeof onComplete === "function") {
      onComplete()
    }
  }, [onComplete])

  useEffect(() => {
    const system = SwaggerUIConstructor({
      plugins,
      spec,
      url,
      dom_id: null,
      domNode: null,
      layout,
      defaultModelsExpandDepth,
      defaultModelRendering,
      presets: [SwaggerUIConstructor.presets.apis, ...presets],
      requestInterceptor,
      responseInterceptor,
      onComplete: handleComplete,
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
    const SwaggerUIComponent = system.getComponent("App", "root")

    systemRef.current = system
    SwaggerUIComponentRef.current = SwaggerUIComponent
    forceUpdate(true)

    return () => {
      systemRef.current = null
      SwaggerUIComponentRef.current = null
    }
  }, [])

  useEffect(() => {
    if (systemRef.current) {
      const prevStateUrl = systemRef.current.specSelectors.url()
      if (url !== prevStateUrl) {
        systemRef.current.specActions.updateSpec("")
        if (url) {
          systemRef.current.specActions.updateUrl(url)
          systemRef.current.specActions.download(url)
        }
      }

      const prevStateSpec = systemRef.current.specSelectors.specStr()
      if (spec && spec !== prevStateSpec) {
        const updatedSpec =
          typeof spec === "object" ? JSON.stringify(spec) : spec
        systemRef.current.specActions.updateSpec(updatedSpec)
      }
    }
  }, [url, spec])

  return SwaggerUIComponentRef.current ? (
    <SwaggerUIComponentRef.current />
  ) : null
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
SwaggerUI.defaultOptions = SwaggerUIConstructor.defaultOptions

export default SwaggerUI
