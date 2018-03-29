import React, { Component } from "react"
import PropTypes from "prop-types"

export default class TruncatableDiv extends Component {
    static propTypes = {
        heightLimit: PropTypes.number,
        children: PropTypes.any.isRequired  
    }

    static defaultProps = {
        heightLimit: 100
    }

    constructor(props) {
        super(props)

        this.state = { 
            truncate: true,
            childrenHeight: 0
        }

        this.toggleTruncation = this.toggleTruncation.bind(this)
    }

    componentDidMount() {
        this.setState({childrenHeight: this.descriptionChildren.clientHeight})
    }

    componentDidUpdate() {
        if (this.state.truncate && typeof this.contents != "undefined" ) this.contents.scrollTop = 0
    }

    toggleTruncation(event) {
        event.preventDefault()
        this.setState( prevState => { 
            return { truncate: !prevState.truncate } 
        })
    }

    render() {
        let { 
            heightLimit,
            children
        } = this.props
        let maxHeightLimit = 500

        if (this.state.childrenHeight < heightLimit) {
            return (
                <div ref={elem => this.descriptionChildren = elem}>
                    <div className="description">
                        { children }
                    </div>
                </div>
            )
        }

        let linkText = this.state.truncate ? "See more" : "See less"
        let maxHeight = this.state.truncate ? `${heightLimit}px` : `${maxHeightLimit}px`
        let descriptionStyling = this.state.truncate ? "description truncated" : "description truncatable"

        return (
            <div>
                <div className={ descriptionStyling } style={{ maxHeight: maxHeight }} ref={elem => this.contents = elem}>
                    { children }
                </div>
                <a href className="expandLink" onClick={this.toggleTruncation}>{ linkText }</a>
            </div>
        )
    }
}
