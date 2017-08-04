import BasePreset from "./base"
import OAS3Plugin from "../plugins/oas3"

// Just the base, for now.

export default function PresetApis() {

  return [
    BasePreset,
    OAS3Plugin
  ]
}
