import { TextDecoder, TextEncoder } from "node:util"

global.TextDecoder = TextDecoder
global.TextEncoder = TextEncoder

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
