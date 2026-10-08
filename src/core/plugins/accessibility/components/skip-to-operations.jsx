import React from "react"

const handleClick = (event) => {
  event.preventDefault()

  // Scope the lookup to this Swagger UI instance so the link works when
  // multiple instances are mounted on the same page.
  const target = event.currentTarget
    .closest(".swagger-ui")
    ?.querySelector("#operations")

  if (target) {
    target.focus()
    target.scrollIntoView()
  }
}

const SkipToOperations = () => {
  return (
    <a
      href="#operations"
      className="swagger-ui__skip-link"
      onClick={handleClick}
    >
      Skip to operations
    </a>
  )
}

export default SkipToOperations
