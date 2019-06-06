import React from "react"
import PropTypes from "prop-types"
import { sanitizeUrl } from "core/utils"

const Contact = ({ data, getComponent }) => {
  const name = data.get("name") || "the developer"
  const url = data.get("url")
  const email = data.get("email")
  const Link = getComponent("Link")

  return (
    <div className="info__contact">
      { url && <div><Link href={ sanitizeUrl(url) } target="_blank">{ name } - Website</Link></div> }
      { email &&
        <Link href={sanitizeUrl(`mailto:${email}`)}>
          { url ? `Send email to ${name}` : `Contact ${name}`}
        </Link>
      }
    </div>
  )
}

Contact.propTypes = {
  data: PropTypes.object,
  getComponent: PropTypes.func.isRequired
}

export default Contact
