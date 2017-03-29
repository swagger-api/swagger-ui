import React, { PropTypes } from "react"

export default class OnlineValidatorBadge extends React.Component {
    static propTypes = {
      getComponent: PropTypes.func.isRequired,
      getConfigs: PropTypes.func.isRequired,
      specSelectors: PropTypes.object.isRequired
    }

    constructor(props, context) {
        super(props, context)
        let { specSelectors, getConfigs } = props
        let { validatorUrl } = getConfigs()
        this.state = {
            url: specSelectors.url(),
            validatorUrl: validatorUrl === undefined ? "https://online.swagger.io/validator" : null
        }
    }

    componentWillReceiveProps(nextProps) {
        let { specSelectors, getConfigs } = nextProps
        let { validatorUrl } = getConfigs()

        this.setState({
            url: specSelectors.url(),
            validatorUrl: validatorUrl === undefined ? "https://online.swagger.io/validator" : null
        })
    }

    render() {
        let { getConfigs } = this.props
        let { spec } = getConfigs()

        if ( typeof spec === "object" && Object.keys(spec).length) return null

        if (!this.state.url || !this.state.validatorUrl) {
          return null
        }

        return (<span style={{ float: "right"}}>
                <a target="_blank" href={`${ this.state.validatorUrl }/debug?url=${ this.state.url }`}>
                    <img alt="Online validator badge" src={`${ this.state.validatorUrl }?url=${ this.state.url }`} />
                </a>
            </span>)
    }
}
