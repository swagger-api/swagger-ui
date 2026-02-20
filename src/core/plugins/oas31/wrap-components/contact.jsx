/**
 * @prettier
 */
import React from "react"

const ContactWrapper = (Original, system) => (props) => {
  const isOAS31 = system.specSelectors.isOAS31?.() || false

  if (isOAS31) {
    const OAS31Contact = system.getComponent("OAS31Contact", true)
    return <OAS31Contact {...props} />
  }

  return <Original {...props} />
}

export default ContactWrapper
