import React, { cloneElement } from "react"
import PropTypes from "prop-types"

//import "./topbar.less"
import Logo from "./logo_small.svg"
import {parseSearch, serializeSearch} from "../../core/utils"

export default class Topbar extends React.Component {

  static propTypes = {
    layoutActions: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context)
    console.log(props);
    this.state = { url: props.specSelectors.url(), selectedIndex: 0, selectedVersionIndex: 0, availableVersions: []}
  }

  // static getDerivedStateFromProps(props, state) {
  //   return {
  //     urls: props.getConfigs() ? props.getConfigs().url : null
  //   }
  // }

  componentWillReceiveProps(nextProps) {
    this.setState({ url: nextProps.specSelectors.url() })
  }

  onUrlChange =(e)=> {
    let {target: {value}} = e
    this.setState({url: value})
  }

  loadSpec = (url, versionIndex) => {
    const config = this.props.getConfigs()
    let urlIndex = config.urls.map(i => i.url).indexOf(url)
    let availableVersions = config.urls[urlIndex].versions
    let replaced = url.replace("{version}", availableVersions[versionIndex])

    this.props.specActions.updateUrl(replaced)
    this.props.specActions.download(replaced)
  }

  onUrlSelect =(e)=> {
    let url = e.target.value || e.target.href
    this.loadSpec(url, 0)
    this.setSelectedUrl(url)
    e.preventDefault()
  }

  onVersionSelect = (e)=> {
    let selectedVersion = e.target.value
    const { urls } = this.props.getConfigs()

    var newVersionIndex = this.getAvailableVersions(this.state.selectedIndex).indexOf(selectedVersion)
    this.setState({selectedVersionIndex: newVersionIndex}, function() {
      console.log("the selected index was, ", newVersionIndex)
      this.loadSpec(urls[this.state.selectedIndex].url, newVersionIndex);
    })
  }

  downloadUrl = (e) => {
    this.loadSpec(this.state.url, this.state.selectedVersionIndex)
    e.preventDefault()
  }

  setSearch = (spec) => {
    let search = parseSearch()
    search["urls.primaryName"] = spec.name
    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`
    if(window && window.history && window.history.pushState) {
      window.history.replaceState(null, "", `${newUrl}?${serializeSearch(search)}`)
    }
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
              this.setSearch(spec)
            }
        })
      }
    }
  }

  getAvailableVersions = (index) => {
    const configs = this.props.getConfigs()
    let availableVersions = configs.urls[index].versions
    return availableVersions;
  }

  componentDidMount() {
    const configs = this.props.getConfigs()
    const urls = configs.urls || []
    this.setState({availableVersions: this.getAvailableVersions(0)})

    if(urls && urls.length) {
      var targetIndex = this.state.selectedIndex
      let primaryName = configs["urls.primaryName"]
      if(primaryName)
      {
        urls.forEach((spec, i) => {
          if(spec.name === primaryName)
            {
              this.setState({selectedIndex: i})
              targetIndex = i
            }
        })
      }

      this.loadSpec(urls[targetIndex].url, 0)
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
      
      let versions = []

      urls[this.state.selectedIndex].versions.forEach((version, index) => {
        versions.push(<option key={index} value={version}>{version}</option>)
      });

      control.push(
        <label className="select-label" htmlFor="select">
          <span>API</span>
          <select id="select-url" disabled={isLoading} onChange={ this.onUrlSelect } value={urls[this.state.selectedIndex].url}>
            {rows}
          </select>

          <span>Version</span>
          <select id="select-version" disabled={isLoading} onChange={ this.onVersionSelect } value={this.state.availableVersions[this.state.selectedVersionIndex]}>
            {versions}
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
            <Link>
              <img height="40" src={ Logo } alt="Swagger UI"/>
            </Link>
            <form className="download-url-wrapper" onSubmit={formOnSubmit}>
              {control.map((el, i) => cloneElement(el, { key: i }))}
            </form>
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
