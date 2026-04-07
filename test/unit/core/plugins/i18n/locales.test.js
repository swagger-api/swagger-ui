/**
 * @prettier
 */
import en from "core/plugins/i18n/locales/en"
import de from "core/plugins/i18n/locales/de"
import es from "core/plugins/i18n/locales/es"
import fr from "core/plugins/i18n/locales/fr"
import is from "core/plugins/i18n/locales/is"
import ko from "core/plugins/i18n/locales/ko"
import pt from "core/plugins/i18n/locales/pt"
import ru from "core/plugins/i18n/locales/ru"
import zh from "core/plugins/i18n/locales/zh"

const NON_ENGLISH_LOCALES = { de, es, fr, is, ko, pt, ru, zh }
const EN_KEYS = Object.keys(en)

describe("i18n locale catalogs", () => {
  it("English catalog is non-empty", () => {
    expect(EN_KEYS.length).toBeGreaterThan(0)
  })

  describe.each(Object.entries(NON_ENGLISH_LOCALES))(
    "%s locale",
    (lang, catalog) => {
      it("has all keys defined in en.js", () => {
        const missingKeys = EN_KEYS.filter(
          (k) => !Object.prototype.hasOwnProperty.call(catalog, k)
        )
        expect(missingKeys).toEqual([])
      })

      it("has no keys absent from en.js (no orphaned keys)", () => {
        const enKeySet = new Set(EN_KEYS)
        const extraKeys = Object.keys(catalog).filter((k) => !enKeySet.has(k))
        expect(extraKeys).toEqual([])
      })

      it("all values are strings", () => {
        for (const value of Object.values(catalog)) {
          expect(typeof value).toBe("string")
        }
      })
    }
  )
})
