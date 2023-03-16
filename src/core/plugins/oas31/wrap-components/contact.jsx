/**
 * @prettier
 */
import React from "react"

const ContactWrapper = (Original, system) => (props) => {
  if (system.specSelectors.isOAS31()) {
    const OAS31Contact = system.getComponent("OAS31Contact", true)

    return <OAS31Contact />
  }

  return <Original {...props} />
}

export default ContactWrapper
