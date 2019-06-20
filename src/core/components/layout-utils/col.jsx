import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"

const DEVICES = {
  "mobile": "",
  "tablet": "-tablet",
  "desktop": "-desktop",
  "large": "-hd"
}

export default class Col extends React.Component {

  render() {
    const {
      hide,
      keepContents,
      /* we don't want these in the `rest` object that passes to the final component,
         since React now complains. So we extract them */
      /* eslint-disable no-unused-vars */
      mobile,
      tablet,
      desktop,
      large,
      /* eslint-enable no-unused-vars */
      ...rest
    } = this.props

    if(hide && !keepContents)
      return <span/>

    let classesAr = []

    for (let device in DEVICES) {
      if (!DEVICES.hasOwnProperty(device)) {
        continue
      }
      let deviceClass = DEVICES[device]
      if(device in this.props) {
        let val = this.props[device]

        if(val < 1) {
          classesAr.push("none" + deviceClass)
          continue
        }

        classesAr.push("block" + deviceClass)
        classesAr.push("col-" + val + deviceClass)
      }
    }

    let classes = cx(rest.className, classesAr.join(" "))

    return (
      <section {...rest} style={{display: hide ? "none": null}} className={classes}/>
    )
  }

}

Col.propTypes = {
  hide: PropTypes.bool,
  keepContents: PropTypes.bool,
  mobile: PropTypes.number,
  tablet: PropTypes.number,
  desktop: PropTypes.number,
  large: PropTypes.number,
  className: PropTypes.string
}
