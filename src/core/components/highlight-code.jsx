import React, { Component } from "react"
import PropTypes from "prop-types"
import { highlight } from "core/utils"

export default class HighlightCode extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    className: PropTypes.string
  }

  componentDidMount() {
    highlight(this.el)
    this.setState({ contentsHidden: this.props.value.length > 600 })
  }

  componentDidUpdate() {
    highlight(this.el)
  }

  initializeComponent = (c) => {
    this.el = c
  }

  onToggleSeeFullContents = () => {
    this.setState({ contentsHidden: !this.state.contentsHidden })
  }

  render () {
    let { value, className } = this.props
    let contentsHidden = this.state && this.state.contentsHidden
    className = className || ""

    return (
      <div>
        <pre
          ref={this.initializeComponent}
          className={className + " microlight" + (contentsHidden ? ' flat-bottom' : '')}>
          { contentsHidden ? value.substring(0, 600) : value }
        </pre>
        { value.length > 600 &&
          <div className='see-full-contents' onClick={this.onToggleSeeFullContents}>
            { contentsHidden ? 'See full contents' : 'Collapse contents'}
          </div>
        }
      </div>
    )
  }
}
