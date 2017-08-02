import React from "react"
import PropTypes from "prop-types"
import SplitPane from "react-split-pane"

const MODE_KEY = ["split-pane-mode"]
const MODE_LEFT = "left"
const MODE_RIGHT = "right"
const MODE_BOTH = "both" // or anything other than left/right

export default class SplitPaneMode extends React.Component {

  static propTypes = {
    threshold: PropTypes.number,

    children: PropTypes.array,

    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
  };

  static defaultProps = {
    threshold: 100, // in pixels
    children: [],
  };

  initializeComponent = (c) => {
    this.splitPane = c
  }

  onDragFinished = () => {
    let { threshold, layoutActions } = this.props
    let { position, draggedSize } = this.splitPane.state
    this.draggedSize = draggedSize

    let nearLeftEdge = position <= threshold
    let nearRightEdge = draggedSize <= threshold

    layoutActions
      .changeMode(MODE_KEY, (
        nearLeftEdge
        ? MODE_RIGHT : nearRightEdge
        ? MODE_LEFT : MODE_BOTH
      ))
  }

  sizeFromMode = (mode, defaultSize) => {
    if(mode === MODE_LEFT) {
      this.draggedSize = null
      return "0px"
    } else if (mode === MODE_RIGHT) {
      this.draggedSize = null
      return "100%"
    }
    // mode === "both"
    return this.draggedSize || defaultSize
  }

  render() {
    let { children, layoutSelectors } = this.props

    const mode = layoutSelectors.whatMode(MODE_KEY)
    const left = mode === MODE_RIGHT ? <noscript/> : children[0]
    const right = mode === MODE_LEFT ? <noscript/> : children[1]
    const size = this.sizeFromMode(mode, "50%")

    return (
      <SplitPane
        disabledClass={""}
        ref={this.initializeComponent}
        split='vertical'
        defaultSize={"50%"}
        primary="second"
        minSize={0}
        size={size}
        onDragFinished={this.onDragFinished}
        allowResize={mode !== MODE_LEFT && mode !== MODE_RIGHT }
        resizerStyle={{"flex": "0 0 auto", "position": "relative"}}
      >
        { left }
        { right }
      </SplitPane>
    )
  }

}
