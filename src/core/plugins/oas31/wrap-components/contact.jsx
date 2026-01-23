/**
 * @prettier
 */
import React from "react"

const ContactWrapper = (Original, system) => (props) => {
  const isOAS31 = system.specSelectors.isOAS31?.() || false
  const isOAS32 = system.specSelectors.isOAS32?.() || false

  // Use OAS31Contact for both OAS 3.1 and OAS 3.2 specs
  if (isOAS31 || isOAS32) {
    const OAS31Contact = system.getComponent("OAS31Contact", true)
    return <OAS31Contact {...props} />
  }

  return <Original {...props} />
}

export default ContactWrapper
