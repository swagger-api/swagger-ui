/**
 * @prettier
 */
import reducers from "./reducers"
import * as actions from "./actions"
import * as selectors from "./selectors"
import en from "./locales/en"
import builtinLocales from "./locales"
import win from "core/window"

export default function I18nPlugin() {
  return {
    afterLoad(system) {
      // ── 1. Load built-in English messages ────────────────────────────────
      system.i18nActions.loadMessages("en", en)

      // ── 2. Determine locale ──────────────────────────────────────────────
      const { locale: configLocale } = system.getConfigs()
      let locale
      if (configLocale) {
        // Normalize configured locale to base language code, same as auto-detection
        locale = configLocale.split("-")[0].toLowerCase()
      } else {
        const browserLang =
          (win.navigator &&
            win.navigator.languages &&
            win.navigator.languages[0]) ||
          (win.navigator && win.navigator.language) ||
          "en"
        locale = browserLang.split("-")[0].toLowerCase()
      }
      system.i18nActions.setLocale(locale)

      // ── 3. Auto-load matching built-in locale (if any) ───────────────────
      if (locale !== "en" && builtinLocales[locale]) {
        system.i18nActions.loadMessages(locale, builtinLocales[locale])
      }

      // ── 4. Register the t() translation function ─────────────────────────
      this.rootInjects = this.rootInjects || {}
      const own = Object.prototype.hasOwnProperty
      this.rootInjects.t = (key, vars) => {
        const allMessages = system.i18nSelectors.getMessages()
        const currentLocale = system.i18nSelectors.getLocale()

        // Use Immutable-native lookups — avoids expensive .toJS() on every call
        const localeMap = allMessages.get(currentLocale)
        const enMap = allMessages.get("en")

        let raw
        if (localeMap && localeMap.has(key)) {
          raw = localeMap.get(key)
        } else if (enMap && enMap.has(key)) {
          raw = enMap.get(key)
        } else {
          // Ultimate fallback: static en object (always available without Redux)
          raw = own.call(en, key) ? en[key] : key
        }

        if (!vars) return String(raw)
        return String(raw).replace(/\{\{(\w+)\}\}/g, (_, k) =>
          own.call(vars, k) ? String(vars[k]) : `{{${k}}}`
        )
      }
    },

    statePlugins: {
      i18n: {
        reducers,
        actions,
        selectors,
      },
    },
  }
}
