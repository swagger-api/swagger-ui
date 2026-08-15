/**
 * @prettier
 */

function afterLoad({ fn }) {
  const originalBuildRequest = fn.buildRequest

  this.fn.buildRequest = (options) => {
    const { requestBody, requestContentType, spec, pathName, method } = options

    if (
      requestBody &&
      requestContentType === "application/x-www-form-urlencoded" &&
      spec &&
      pathName &&
      method
    ) {
      const operation =
        spec.paths &&
        spec.paths[pathName] &&
        spec.paths[pathName][method.toLowerCase()]

      if (operation && operation.requestBody) {
        const mediaType =
          operation.requestBody.content &&
          operation.requestBody.content["application/x-www-form-urlencoded"]

        if (mediaType && mediaType.schema && mediaType.schema.properties) {
          const properties = mediaType.schema.properties
          const existingEncoding = mediaType.encoding || {}

          const needsDefaults = Object.keys(properties).some((propName) => {
            const prop = properties[propName]
            const isArray =
              prop &&
              (prop.type === "array" ||
                (Array.isArray(prop.type) && prop.type.includes("array")))
            return isArray && !existingEncoding[propName]
          })

          if (needsDefaults) {
            const encoding = { ...existingEncoding }

            Object.keys(properties).forEach((propName) => {
              if (!encoding[propName]) {
                const prop = properties[propName]
                const isArray =
                  prop &&
                  (prop.type === "array" ||
                    (Array.isArray(prop.type) && prop.type.includes("array")))
                if (isArray) {
                  encoding[propName] = { style: "form", explode: true }
                }
              }
            })

            mediaType.encoding = encoding
          }
        }
      }
    }

    return originalBuildRequest(options)
  }
}

export default afterLoad
