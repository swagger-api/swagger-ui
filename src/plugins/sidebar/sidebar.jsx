import React from 'react'
import { createDeepLinkPath, sanitizeUrl } from "core/utils"
import Im from "immutable"

export default class Sidebar extends React.Component {
  constructor() {
    super();
    this.state = {
      paths: []
    };
  }

  componentDidMount() {
    fetch('http://petstore.swagger.io/v2/swagger.json')
    .then(result => {
      return result.json()
    })
    .then(data => {
      this.setState({
        paths: data.tags
      })
    })
  }

  render() {
    let {
      specSelectors,
      layoutSelectors,
      getConfigs
    } = this.props

    let taggedOps = specSelectors.taggedOperations()

    let {
      maxDisplayedTags
    } = getConfigs()

    let filter = layoutSelectors.currentFilter()

    if (filter) {
      if (filter !== true) {
        taggedOps = fn.opsFilter(taggedOps, filter)
      }
    }

    if (maxDisplayedTags && !isNaN(maxDisplayedTags) && maxDisplayedTags >= 0) {
      taggedOps = taggedOps.slice(0, maxDisplayedTags)
    }

    return (
      <nav id="scrollingNav">
        <div className="sidenav-search" id="searchBar">
          <input className="form-control search" type="text" placeholder="Filter search..." id="searchInput"></input>
          <span className="search-reset">x</span>
        </div>
        <div className="adjustSidebar">
          <ul className="sidenav" id="sidenav">
            <div id="errorMsg"></div>
            {
              taggedOps.map((tagObj, tag) => {
                let operations = tagObj.get("operations")
                console.log(tag)
                let headerRef = ["operations-tag", createDeepLinkPath(tag)]
                return (
                  <div className="header">
                  <li className="nav-header"><a href={`#${headerRef.join("-")}`}>{tag}</a></li>
                    {
                      operations.map(op => {
                        const path = op.get("path")
                        const method = op.get("method")
                        const summary = op.getIn(["operation", "summary"])
                        const operationId = op.getIn(["operation", "operationId"])
                        let methodRef = ["operations", tag, operationId]
                        return (
                          <div className="methods">
                          <li className="is-new"><a href={`#${methodRef.join("-")}`}>{summary}</a></li>
                          </div>
                        )
                      }).toArray()
                    }
                  </div>
                )
              }).toArray()
            }
          </ul>
        </div>
      </nav>
    )
  }
}