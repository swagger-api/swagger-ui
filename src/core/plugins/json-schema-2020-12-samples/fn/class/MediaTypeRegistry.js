/**
 * @prettier
 */
import Registry from "./Registry"
import textMediaTypesGenerators from "../generators/media-types/text"
import imageMediaTypesGenerators from "../generators/media-types/image"
import audioMediaTypesGenerators from "../generators/media-types/audio"
import videoMediaTypesGenerators from "../generators/media-types/video"
import applicationMediaTypesGenerators from "../generators/media-types/application"

class MediaTypeRegistry extends Registry {
  #defaults = {
    ...textMediaTypesGenerators,
    ...imageMediaTypesGenerators,
    ...audioMediaTypesGenerators,
    ...videoMediaTypesGenerators,
    ...applicationMediaTypesGenerators,
  }

  data = { ...this.#defaults }

  get defaults() {
    return { ...this.#defaults }
  }
}

export default MediaTypeRegistry
