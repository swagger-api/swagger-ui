/**
 * @prettier
 */
import { translate, fallbackT } from "core/plugins/i18n/fn"

describe("i18n fn - translate", () => {
  const enMessages = {
    "button.cancel": "Cancel",
    "button.execute": "Execute",
    "errors.jump_to_line": "Jump to line {{line}}",
    "label.name": "Name",
  }

  describe("key lookup", () => {
    it("returns the locale message when key exists in locale messages", () => {
      const frMessages = { "button.cancel": "Annuler" }
      expect(translate(frMessages, enMessages, "button.cancel")).toBe("Annuler")
    })

    it("falls back to english messages when key is missing from locale messages", () => {
      const frMessages = {}
      expect(translate(frMessages, enMessages, "button.cancel")).toBe("Cancel")
    })

    it("returns the raw key when key is missing from both locale and fallback messages", () => {
      expect(translate({}, {}, "unknown.key")).toBe("unknown.key")
    })

    it("handles null localeMsgs gracefully by falling back to english", () => {
      expect(translate(null, enMessages, "button.cancel")).toBe("Cancel")
    })

    it("handles undefined localeMsgs gracefully by falling back to english", () => {
      expect(translate(undefined, enMessages, "button.cancel")).toBe("Cancel")
    })

    it("handles null fallbackMsgs gracefully by returning the key", () => {
      expect(translate(null, null, "button.cancel")).toBe("button.cancel")
    })

    it("always returns a string (consistent return type without vars)", () => {
      expect(typeof translate(enMessages, enMessages, "button.cancel")).toBe(
        "string"
      )
    })

    it("does not resolve inherited prototype properties as translations", () => {
      // 'toString' exists on Object.prototype — it must not be treated as a match
      expect(translate({}, {}, "toString")).toBe("toString")
      expect(translate(null, {}, "toString")).toBe("toString")
    })
  })

  describe("variable interpolation", () => {
    it("interpolates {{varName}} placeholders with vars", () => {
      const result = translate(enMessages, enMessages, "errors.jump_to_line", {
        line: 42,
      })
      expect(result).toBe("Jump to line 42")
    })

    it("converts var values to strings", () => {
      const msgs = { msg: "Value is {{val}}" }
      expect(translate(msgs, msgs, "msg", { val: 123 })).toBe("Value is 123")
    })

    it("leaves unknown placeholders as-is", () => {
      const msgs = { msg: "Hello {{name}} and {{other}}" }
      expect(translate(msgs, msgs, "msg", { name: "World" })).toBe(
        "Hello World and {{other}}"
      )
    })

    it("returns the message unchanged when vars is not provided", () => {
      const result = translate(enMessages, enMessages, "button.cancel")
      expect(result).toBe("Cancel")
    })

    it("returns the message unchanged when vars is null", () => {
      const result = translate(enMessages, enMessages, "button.cancel", null)
      expect(result).toBe("Cancel")
    })

    it("does not use inherited var properties as substitutions", () => {
      // vars inheriting toString from Object.prototype must not substitute {{toString}}
      const msgs = { msg: "value is {{toString}}" }
      expect(translate(msgs, {}, "msg", {})).toBe("value is {{toString}}")
    })
  })

  describe("locale override", () => {
    it("uses locale message over fallback when both have the key", () => {
      const deMessages = { "button.cancel": "Abbrechen" }
      expect(translate(deMessages, enMessages, "button.cancel")).toBe(
        "Abbrechen"
      )
    })

    it("uses english fallback for keys missing in locale", () => {
      const deMessages = { "button.cancel": "Abbrechen" }
      expect(translate(deMessages, enMessages, "button.execute")).toBe(
        "Execute"
      )
    })
  })
})

describe("i18n fn - fallbackT", () => {
  it("returns the English string for a known key", () => {
    expect(fallbackT("button.execute")).toBe("Execute")
    expect(fallbackT("button.cancel")).toBe("Cancel")
    expect(fallbackT("button.authorize")).toBe("Authorize")
  })

  it("returns the raw key for an unknown key", () => {
    expect(fallbackT("unknown.key")).toBe("unknown.key")
  })

  it("interpolates variables in English messages", () => {
    expect(fallbackT("errors.jump_to_line", { line: 7 })).toBe("Jump to line 7")
  })

  it("always returns a string", () => {
    expect(typeof fallbackT("button.execute")).toBe("string")
    expect(typeof fallbackT("nonexistent.key")).toBe("string")
  })
})
