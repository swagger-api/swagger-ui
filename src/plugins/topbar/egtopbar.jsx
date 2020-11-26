import React, { cloneElement } from "react"
import PropTypes from "prop-types"

import Logo from "./logo_small.svg"

export default class EgTopbar extends React.Component {

  static propTypes = {
    layoutActions: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
        urls: {},
        currentRepository: null,
        currentBranch: null,
    }
  }

  defaultBranch(repository) {
    return repository.includes("master") ? "master" : repository[0]
  }

  onRepositoryChange = e => {
    const repository = e.target.value

    this.setState({
      currentRepository: repository,
      currentBranch: this.defaultBranch(this.state.urls[repository])
    }, this.loadLocalSpec)
  }

  onBranchChange = e => {
    const branch = e.target.value

    this.setState({
      currentBranch: branch,
    }, this.loadLocalSpec)
  }

  fetchUrls = async () => {
      const egConfig = this.props.getConfigs().egConfig

      const request = await fetch(egConfig)

      if (!request.ok) throw new Error(request.status)

      const urls = await request.json()

      this.setState({urls})
  }

  loadSpec = (url) => {
    this.props.specActions.updateUrl(url)
    this.props.specActions.download(url)
  }

  loadLocalSpec = () => {
    const template = this.props.getConfigs().egTemplate
    const {currentRepository, currentBranch} = this.state

    this.loadSpec(template.replace(/\$repository/g, currentRepository).replace(/\$branch/g, currentBranch))
  }

  async componentDidMount() {
    await this.fetchUrls()

    const {urls} = this.state

    const [defaultRepository] = Object.keys(urls)

    this.setState({
      currentRepository: defaultRepository,
      currentBranch: this.defaultBranch(urls[defaultRepository])
    }, this.loadLocalSpec)
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

    if (!Object.keys(urls).length) return <span>No urls found.</span>
    if (!currentRepository || !currentBranch) return <span>Not initialized.</span>

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
