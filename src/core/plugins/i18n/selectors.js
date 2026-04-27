/**
 * @prettier
 */
import { Map } from "immutable"

export const getLocale = (state) => state.get("locale", "en")

export const getMessages = (state) => state.get("messages", Map())
