import { OAS3ComponentWrapFactory } from "../helpers"
import OnlineValidatorBadge from "core/components/online-validator-badge"

// We're disabling the Online Validator Badge until the online validator
// can handle OAS3 specs.
// export default OAS3ComponentWrapFactory(() => null)
// OAS3 spec is now supported. Return OnlineValidatorBadge.
// export default OAS3ComponentWrapFactory(OnlineValidatorBadge)


const VALIDATOR_CAN_HANDLE_OAS3_SPECS = true

export const handleFlag = (wrapped) => {
  if (VALIDATOR_CAN_HANDLE_OAS3_SPECS) {
    return (
      wrapped(OnlineValidatorBadge)
    )
  }
  return (
    // renders but console error: setState(...): Can only update a mounted or mounting component. This usually means you called setState() on an unmounted component. This is a no-op. Please check the code for the ValidatorImage component.
    wrapped(() => null)
  )
}
export default handleFlag(OAS3ComponentWrapFactory)
