import React, { cloneElement } from "react"
import PropTypes from "prop-types"

import Logo from "./logo_small.svg"
import { parseSearch, serializeSearch } from "../../core/utils"

export default class EgTopbar extends React.Component {

  static propTypes = {
    layoutActions: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
        url: props.specSelectors.url(),
        selectedIndex: 0,
        urls: {},
        currentRepository: null,
        currentBranch: null,
    }
  }

  onUrlChange =(e)=> {
    let {target: {value}} = e
    this.setState({url: value})
  }

  onRepositoryChange = e => {
    const repository = e.target.value

    this.setState({
      currentRepository: repository,
      currentBranch: this.state.urls[repository][0]
    })
  }

  onBranchChange = e => {
    const branch = e.target.value

    this.setState({
      currentBranch: branch,
    })
  }

  fetchUrls = async () => {
      const configUrl = this.props.getConfigs()

      const request = await fetch(configUrl)

      if (!request.ok) throw new Error(request.status)

      const urls = await request.json()

      this.setState({urls})
  }

  loadSpec = (url) => {
    this.props.specActions.updateUrl(url)
    this.props.specActions.download(url)
  }

  loadLocalSpec = () => {
    const {currentRepository, currentBranch} = this.state

    this.loadSpec(`https://github.com/${currentRepository}/${currentBranch}/swagger.json`)
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

  async componentDidMount() {
    await this.fetchUrls()

    const {urls} = this.state

    const [defaultRepository] = Object.keys(urls)

    this.setState({
      currentRepository: defaultRepository,
      currentBranch: urls[defaultRepository][0]
    })

    this.loadLocalSpec()
  }

  onFilterChange =(e) => {
    let {target: {value}} = e
    this.props.layoutActions.updateFilter(value)
  }

  render() {
    let { getComponent, specSelectors } = this.props
    const Link = getComponent("Link")

    let isLoading = specSelectors.loadingStatus() === "loading"
    let isFailed = specSelectors.loadingStatus() === "failed"

    const classNames = ["download-url-input"]
    if (isFailed) classNames.push("failed")
    if (isLoading) classNames.push("loading")
    
    const { urls, currentBranch, currentRepository } = this.state

    let control = []
    let formOnSubmit = null

    const repos = Object.keys(urls).map(repo => <option key={repo} value={repo}>{repo}</option>)
    const branches = urls[currentRepository].map(branch => <option key={branch} value={branch}>{branch}</option>)

    control.push(
      <label className="select-label" htmlFor="select-repo"><span>Select a repository</span>
        <select id="select-repo" disabled={isLoading} onChange={ this.onRepositoryChange } value={currentRepository}>
          {repos}
        </select>
      </label>
    )

    control.push(
      <label className="select-label" htmlFor="select-branch"><span>Select a branch</span>
        <select id="select-branch" disabled={isLoading} onChange={ this.onBranchChange } value={currentBranch}>
          {branches}
        </select>
      </label>
    )

    return (
      <div className="topbar">
        <div className="wrapper">
          <div className="topbar-wrapper">
            <Link>
              <img height="40" src={ Logo } alt="Swagger UI (Easygenerator)"/>
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

EgTopbar.propTypes = {
  specSelectors: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  getConfigs: PropTypes.func.isRequired
}
