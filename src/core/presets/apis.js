import BasePreset from "./base"

import allowTryItOutIfHost from "core/plugins/allow-try-it-out-if-host"

export default function PresetApis() {

  return [
    BasePreset,
    allowTryItOutIfHost,
  ]
}
