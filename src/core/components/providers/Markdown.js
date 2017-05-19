import Remarkable from "react-remarkable"
import React from "react"


export default ({ source }) => {
  return <Remarkable
    options={{html: true, typographer: true, linkify: true, linkTarget: "_blank"}}
    source={source}
    ></Remarkable>
}
