import * as langPack from "./languages"
import get from "lodash/get"
import template from "lodash/template"
import templateSettings from "lodash/templateSettings"
import { memoize } from "core/utils"

templateSettings.interpolate = /{{([\s\S]+?)}}/g

const memTemplate = memoize(template)

function translate(getConfigs, key, data) {
  const { translations, translationLanguage: language = "en", defaultTranslationLanguage: defaultLanguage = "en" } = getConfigs()
  const defaultTranslations = langPack[defaultLanguage]
  let result

  if (!translations) {
    result = get(langPack[language], key)

    if (typeof result !== "string") {
      result = get(defaultTranslations, key)
    }
  } else {
    result = get(translations, key)
  }

  if (typeof result !== "string") {
   result = key
  }

  if (data) {
    const template = memTemplate(result)

    return template(data)
  }

  return result
}


export default function({ getConfigs }) {
  const memTranslate = memoize(translate.bind(null, getConfigs))

  return {
    rootInjects: {
      translate: memTranslate
    }
  }
}
