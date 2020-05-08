import React from "react"

const Wrapper = (Ori, system) => class ModelsWrapper extends React.Component {

  onLoad = (ref) => {
    const isShownKey = ["models"]
    system.layoutActions.readyToScroll(isShownKey, ref)
  }

  render() {
    return (
      <span ref={this.onLoad}>
        <Ori {...this.props} />
      </span>
    )
  }
}

export default Wrapper
