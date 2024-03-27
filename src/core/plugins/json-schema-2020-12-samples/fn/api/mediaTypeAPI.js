/**
 * @prettier
 */

import MediaTypeRegistry from "../class/MediaTypeRegistry"

const registry = new MediaTypeRegistry()

const mediaTypeAPI = (mediaType, generator) => {
  if (typeof generator === "function") {
    return registry.register(mediaType, generator)
  } else if (generator === null) {
    return registry.unregister(mediaType)
  }

  const mediaTypeNoParams = mediaType.split(";").at(0)
  const topLevelMediaType = `${mediaTypeNoParams.split("/").at(0)}/*`

  return (
    registry.get(mediaType) ||
    registry.get(mediaTypeNoParams) ||
    registry.get(topLevelMediaType)
  )
}
mediaTypeAPI.getDefaults = () => registry.defaults

export default mediaTypeAPI
