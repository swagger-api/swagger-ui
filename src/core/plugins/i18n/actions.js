/**
 * @prettier
 */

export const SET_LOCALE = "i18n_set_locale"
export const LOAD_MESSAGES = "i18n_load_messages"

export function setLocale(locale) {
  return {
    type: SET_LOCALE,
    payload: locale,
  }
}

export function loadMessages(locale, messages) {
  return {
    type: LOAD_MESSAGES,
    payload: { locale, messages },
  }
}
