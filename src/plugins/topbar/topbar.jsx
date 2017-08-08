import React from "react"
import PropTypes from "prop-types"

//import "./topbar.less"
import Logo from "./b24logo.png"

export default class Topbar extends React.Component {

  static propTypes = {
    layoutActions: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context)
    this.state = { url: props.specSelectors.url(), selectedIndex: 0 }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ url: nextProps.specSelectors.url() })
  }

  onUrlChange =(e)=> {
    let {target: {value}} = e
    this.setState({url: value})
  }

  loadSpec = (url) => {
    this.props.specActions.updateUrl(url)
    this.props.specActions.download(url)
  }

  onUrlSelect =(e)=> {
    let url = e.target.value || e.target.href
    this.loadSpec(url)
    this.setSelectedUrl(url)
    e.preventDefault()
  }

  downloadUrl = (e) => {
    this.loadSpec(this.state.url)
    e.preventDefault()
  }

  setSelectedUrl = (selectedUrl) => {
    const configs = this.props.getConfigs()
    const urls = configs.urls || []

    if(urls && urls.length) {
      if(selectedUrl)
      {
        urls.forEach((spec, i) => {
          if(spec.url === selectedUrl)
            {
              this.setState({selectedIndex: i})
            }
        })
      }
    }
  }

  componentWillMount() {
    const configs = this.props.getConfigs()
    const urls = configs.urls || []

    if(urls && urls.length) {
      let primaryName = configs["urls.primaryName"]
      if(primaryName)
      {
        urls.forEach((spec, i) => {
          if(spec.name === primaryName)
            {
              this.setState({selectedIndex: i})
            }
        })
      }
    }
  }

  componentDidMount() {
    const urls = this.props.getConfigs().urls || []

    if(urls && urls.length) {
      this.loadSpec(urls[this.state.selectedIndex].url)
    }
  }

  onFilterChange =(e) => {
    let {target: {value}} = e
    this.props.layoutActions.updateFilter(value)
  }

  render() {
    let { getComponent, specSelectors, getConfigs } = this.props
    const Button = getComponent("Button")
    const Link = getComponent("Link")

    let isLoading = specSelectors.loadingStatus() === "loading"
    let isFailed = specSelectors.loadingStatus() === "failed"

    let inputStyle = {}
    if(isFailed) inputStyle.color = "red"
    if(isLoading) inputStyle.color = "#aaa"

    const { urls } = getConfigs()
    let control = []
    let formOnSubmit = null

    if(urls) {
      let rows = []
      urls.forEach((link, i) => {
        rows.push(<option key={i} value={link.url}>{link.name}</option>)
      })

      control.push(
        <label className="select-label" htmlFor="select"><span>Select a spec</span>
          <select id="select" disabled={isLoading} onChange={ this.onUrlSelect } value={urls[this.state.selectedIndex].url}>
            {rows}
          </select>
        </label>
      )
    }
    else {
      formOnSubmit = this.downloadUrl
      control.push(<input className="download-url-input" type="text" onChange={ this.onUrlChange } value={this.state.url} disabled={isLoading} style={inputStyle} />)
      control.push(<Button className="download-url-button" onClick={ this.downloadUrl }>Explore</Button>)
    }

    return (
      <div className="topbar">
        <div className="wrapper">
          <div className="topbar-wrapper">
            <Link className="link-logo" href="https://binary24.com/#/home" title="BINARY 24">
              <img height="39" width="127" src={ Logo } alt="BINARY 24"/>
            </Link>

            <ol>
              <li><a href="https://binary24.com/#/home">Home</a></li>
              <li className="list-down"><a>Trading</a><div className="active-bar"></div>
                <ul>
                  <li><a href="https://binary24.com/#/trading-conditions">Trading conditions</a></li>
                  <li><a href="https://binary24.com/#/deposits">Deposits</a></li>
                  <li><a href="https://binary24.com/#/trading-assets">Assets</a></li>
                  <li><a href="https://binary24.com/#/api-trading">Api Trading</a></li>
                </ul>
              </li>
              <li className="list-down"><a>Education</a>
                <ul>
                  <li><a href="https://binary24.com/#/quick-start">Quick start</a></li>
                  <li><a href="https://binary24.com/#/faq">FAQ</a></li>
                  <li><a href="https://binary24.com/#/live-support">Live Support</a></li>
                </ul>
              </li>
              <li><a href="https://binary24.com/#/affiliates">Affiliates</a></li>
              <li className="list-down"><a>Policies</a>
                <ul>
                  <li><a href="https://binary24.com/#/aml-policy">AML Policies</a></li>
                  <li><a href="https://binary24.com/#/privacy-policy">Privacy Policy</a></li>
                  <li><a href="https://binary24.com/#/risk-notice">Risk Notice</a></li>
                  <li><a href="https://binary24.com/#/terms-and-conditions">Terms and Conditions</a></li>
                </ul>
              </li>
              <li className="list-down"><a>About us</a>
                <ul>
                  <li><a href="https://binary24.com/#/about">Who we are</a></li>
                  <li><a href="https://binary24.com/#/awards">Awards and recognitions</a></li>
                  <li><a href="https://binary24.com/#/contact">Contact us</a></li>
                </ul>
              </li>
            </ol>
            <div className="right-buttons">
              <a href="https://app.binary24.com/" target="_blank"><div className="green-btn">VIEW DEMO</div></a>
              <a href="https://app.binary24.com/login" target="_blank"><div className="blue-btn">SIGN UP/LOG IN</div></a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Topbar.propTypes = {
  specSelectors: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  getConfigs: PropTypes.func.isRequired
}
