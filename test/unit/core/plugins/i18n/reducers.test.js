/**
 * @prettier
 */
import { Map, fromJS } from "immutable"
import reducers from "core/plugins/i18n/reducers"
import { SET_LOCALE, LOAD_MESSAGES } from "core/plugins/i18n/actions"

describe("i18n reducers", () => {
  const initialState = new Map()

  describe("SET_LOCALE", () => {
    it("sets the locale in state", () => {
      const action = { type: SET_LOCALE, payload: "fr" }
      const newState = reducers[SET_LOCALE](initialState, action)
      expect(newState.get("locale")).toBe("fr")
    })

    it("updates the locale when called again", () => {
      const state = new Map({ locale: "en" })
      const action = { type: SET_LOCALE, payload: "de" }
      const newState = reducers[SET_LOCALE](state, action)
      expect(newState.get("locale")).toBe("de")
    })
  })

  describe("LOAD_MESSAGES", () => {
    it("loads messages for a locale into state", () => {
      const messages = {
        "button.cancel": "Annuler",
        "button.execute": "Exécuter",
      }
      const action = {
        type: LOAD_MESSAGES,
        payload: { locale: "fr", messages },
      }
      const newState = reducers[LOAD_MESSAGES](initialState, action)

      expect(newState.getIn(["messages", "fr", "button.cancel"])).toBe(
        "Annuler"
      )
      expect(newState.getIn(["messages", "fr", "button.execute"])).toBe(
        "Exécuter"
      )
    })

    it("merges messages for an existing locale, not replacing", () => {
      const state = fromJS({
        messages: {
          fr: { "button.cancel": "Annuler", "button.execute": "Exécuter" },
        },
      })
      const additionalMessages = { "button.close": "Fermer" }
      const action = {
        type: LOAD_MESSAGES,
        payload: { locale: "fr", messages: additionalMessages },
      }
      const newState = reducers[LOAD_MESSAGES](state, action)

      expect(newState.getIn(["messages", "fr", "button.cancel"])).toBe(
        "Annuler"
      )
      expect(newState.getIn(["messages", "fr", "button.close"])).toBe("Fermer")
    })

    it("overrides existing messages for a locale", () => {
      const state = fromJS({
        messages: {
          fr: { "button.cancel": "Annuler" },
        },
      })
      const overrideMessages = { "button.cancel": "Nouvelle Annuler" }
      const action = {
        type: LOAD_MESSAGES,
        payload: { locale: "fr", messages: overrideMessages },
      }
      const newState = reducers[LOAD_MESSAGES](state, action)

      expect(newState.getIn(["messages", "fr", "button.cancel"])).toBe(
        "Nouvelle Annuler"
      )
    })

    it("loads messages for multiple locales independently", () => {
      const frMessages = { "button.cancel": "Annuler" }
      const deMessages = { "button.cancel": "Abbrechen" }

      let state = reducers[LOAD_MESSAGES](initialState, {
        type: LOAD_MESSAGES,
        payload: { locale: "fr", messages: frMessages },
      })
      state = reducers[LOAD_MESSAGES](state, {
        type: LOAD_MESSAGES,
        payload: { locale: "de", messages: deMessages },
      })

      expect(state.getIn(["messages", "fr", "button.cancel"])).toBe("Annuler")
      expect(state.getIn(["messages", "de", "button.cancel"])).toBe("Abbrechen")
    })
  })
})
