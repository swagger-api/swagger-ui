import React from "react"
import URL from "url-parse"

import PropTypes from "prop-types"
import { sanitizeUrl, requiresValidationURL } from "core/utils"
import win from "core/window"

export default class OnlineValidatorBadge extends React.Component {
    static propTypes = {
      getComponent: PropTypes.func.isRequired,
      getConfigs: PropTypes.func.isRequired,
      specSelectors: PropTypes.object.isRequired
    }

    constructor(props, context) {
        super(props, context)
        let { getConfigs } = props
        let { validatorUrl } = getConfigs()
        this.state = {
            url: this.getDefinitionUrl(),
            validatorUrl: validatorUrl === undefined ? "https://validator.swagger.io/validator" : validatorUrl
        }
    }

    getDefinitionUrl = () => {
      // TODO: test this behavior by stubbing `window.location` in an Enzyme/JSDom env
      let { specSelectors } = this.props

      const urlObject = new URL(specSelectors.url(), win.location)
      return urlObject.toString()
    }

    componentWillReceiveProps(nextProps) {
        let { getConfigs } = nextProps
        let { validatorUrl } = getConfigs()

        this.setState({
            url: this.getDefinitionUrl(),
            validatorUrl: validatorUrl === undefined ? "https://validator.swagger.io/validator" : validatorUrl
        })
    }

    render() {
        let { getConfigs } = this.props
        let { spec } = getConfigs()

        let sanitizedValidatorUrl = sanitizeUrl(this.state.validatorUrl)

        if ( typeof spec === "object" && Object.keys(spec).length) return null

        if (!this.state.url || !requiresValidationURL(this.state.validatorUrl)
                            || !requiresValidationURL(this.state.url)) {
          return null
        }

        return (<span className="float-right">
                <a target="_blank" rel="noopener noreferrer" href={`${ sanitizedValidatorUrl }/debug?url=${ encodeURIComponent(this.state.url) }`}>
                    <ValidatorImage src={`${ sanitizedValidatorUrl }?url=${ encodeURIComponent(this.state.url) }`} alt="Online validator badge"/>
                </a>
            </span>)
    }
}


class ValidatorImage extends React.Component {
  static propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string
  }

  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      error: false
    }
  }

  componentDidMount() {
    const img = new Image()
    img.onload = () => {
      this.setState({
        loaded: true
      })
    }
    img.onerror = () => {
      this.setState({
        error: true
      })
    }
    img.src = this.props.src
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.src !== this.props.src) {
      const img = new Image()
      img.onload = () => {
        this.setState({
          loaded: true
        })
      }
      img.onerror = () => {
        this.setState({
          error: true
        })
      }
      img.src = nextProps.src
    }
  }

  render() {
    if (this.state.error) {
      return <img alt={"Error"} />
    } else if (!this.state.loaded) {
      return null
    }
    return <img src={this.props.src} alt={this.props.alt} />
  }
}
