import React from "react"
import PropTypes from "prop-types"

export default class BaseLayout extends React.Component {

  static propTypes = {
    errSelectors: PropTypes.object.isRequired,
    errActions: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    oas3Selectors: PropTypes.object.isRequired,
    oas3Actions: PropTypes.object.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired
  }

  onFilterChange =(e) => {
    let {target: {value}} = e
    this.props.layoutActions.updateFilter(value)
  }

  render() {
    let {
      specSelectors,
      specActions,
      getComponent,
      layoutSelectors,
      oas3Selectors,
      oas3Actions
    } = this.props

    let info = specSelectors.info()
    let url = specSelectors.url()
    let basePath = specSelectors.basePath()
    let host = specSelectors.host()
    let securityDefinitions = specSelectors.securityDefinitions()
    let externalDocs = specSelectors.externalDocs()
    let schemes = specSelectors.schemes()
    let servers = specSelectors.servers()

    let Info = getComponent("info")
    let Operations = getComponent("operations", true)
    let Models = getComponent("Models", true)
    let AuthorizeBtn = getComponent("authorizeBtn", true)
    let Row = getComponent("Row")
    let Col = getComponent("Col")
    let Servers = getComponent("Servers")
    let Errors = getComponent("errors", true)

    let isLoading = specSelectors.loadingStatus() === "loading"
    let isFailed = specSelectors.loadingStatus() === "failed"
    let filter = layoutSelectors.currentFilter()

    let inputStyle = {}
    if(isFailed) inputStyle.color = "red"
    if(isLoading) inputStyle.color = "#aaa"

    const Schemes = getComponent("schemes")

    const isSpecEmpty = !specSelectors.specStr()

    if(isSpecEmpty) {
      let loadingMessage
      if(isLoading) {
        loadingMessage = <div className="loading"></div>
      } else {
        loadingMessage = <h4>No API definition provided.</h4>
      }

      return <div className="swagger-ui">
        <div className="loading-container">
          {loadingMessage}
        </div>
      </div>
    }

    return (

      <div className='swagger-ui'>
        {/* Start of Dor's code */}
        {/*<a href="#topofpage" id="backToTop">Back to Top</a>*/}
        <nav id="scrollingNav">
          <div className="sidenav-search" id="searchBar">
            <input className="form-control search" type="text" placeholder="Filter search..." id="searchInput"></input>
            <span className="search-reset">x</span>
          </div>
          <div className="adjustSidebar">
            <ul className="sidenav" id="sidenav">
              <div id="errorMsg"></div>
              <li id="1" className="nav-header"><a href="#operations-tag-pet">Pet</a></li>
              <li id="2" className="is-new"><a href="#operations-pet-addPet">Add a new pet to the store</a></li>
              <li id="3" className="is-new"><a href="#operations-pet-updatePet">Update an existing pet</a></li>
              <li id="4" className="is-new"><a href="#operations-pet-findPetsByStatus">Find pet by status</a></li>
              <li id="5" className="is-new"><a href="#operations-pet-findPetsByTags">Find pet by tags</a></li>
              <li id="6" className="is-new"><a href="#operations-pet-getPetById">Find pet by ID</a></li>
              <li id="7" className="is-new"><a href="#operations-pet-updatePetWithForm">Update a pet in the store with form data</a></li>
              <li id="8" className="is-new"><a href="#operations-pet-deletePet">Delete a pet</a></li>
              <li id="9" className="is-new"><a href="#operations-pet-uploadFile">Upload an image</a></li>
              <li id="10" className="nav-header"><a href="#operations-tag-store">Store</a></li>
              <li id="11" className="is-new"><a href="#operations-store-getInventory">Return pet inventories by status</a></li>
              <li id="12" className="is-new"><a href="#operations-store-placeOrder">Place an order for a pet</a></li>
              <li id="13" className="is-new"><a href="#operations-store-getOrderById">Find purchase order by ID</a></li>
              <li id="14" className="is-new"><a href="#operations-store-deleteOrder">Delete purchase order by ID</a></li>
              <li id="15" className="nav-header"><a href="#operations-tag-user">User</a></li>
              <li id="16" className="is-new"><a href="#operations-user-createUser">Create User</a></li>
              <li id="17" className="is-new"><a href="#operations-user-createUsersWithArrayInput">Create list of users with given input array</a></li>
              <li id="18" className="is-new"><a href="#operations-user-createUsersWithListInput">Create list of users with given input array</a></li>
              <li id="19" className="is-new"><a href="#operations-user-loginUser">Log user into the system</a></li>
              <li id="20" className="is-new"><a href="#operations-user-logoutUser">Log out current logged in user session</a></li>
              <li id="21" className="is-new"><a href="#operations-user-getUserByName">Get user by username</a></li>
              <li id="22" className="is-new"><a href="#operations-user-updateUser">Update user</a></li>
              <li id="23" className="is-new"><a href="#operations-user-deleteUser">Delete user</a></li>
            </ul>
          </div>
        </nav>
        {/* End of Dor's code */}
          <div style={{marginLeft: "270px"}}>
            <Errors/>
            <Row className="information-container">
              <Col mobile={12}>
                { info.count() ? (
                  <Info info={ info } url={ url } host={ host } basePath={ basePath } externalDocs={externalDocs} getComponent={getComponent}/>
                ) : null }
              </Col>
            </Row>
            { schemes && schemes.size || securityDefinitions ? (
              <div className="scheme-container">
                <Col className="schemes wrapper" mobile={12}>
                  { schemes && schemes.size ? (
                    <Schemes
                      currentScheme={specSelectors.operationScheme()}
                      schemes={ schemes }
                      specActions={ specActions } />
                  ) : null }

                  { securityDefinitions ? (
                    <AuthorizeBtn />
                  ) : null }
                </Col>
              </div>
            ) : null }

            { servers && servers.size ? (
              <div className="global-server-container">
                <Col className="servers wrapper" mobile={12}>
                  <span className="servers-title">Server</span>
                  <Servers
                    servers={servers}
                    currentServer={oas3Selectors.selectedServer()}
                    setSelectedServer={oas3Actions.setSelectedServer}
                    setServerVariableValue={oas3Actions.setServerVariableValue}
                    getServerVariable={oas3Selectors.serverVariableValue}
                    getEffectiveServerValue={oas3Selectors.serverEffectiveValue}
                    />
                </Col>
              </div>

            ) : null}

            {
              filter === null || filter === false ? null :
                <div className="filter-container">
                  <Col className="filter wrapper" mobile={12}>
                    <input className="operation-filter-input" placeholder="Filter by tag" type="text" onChange={this.onFilterChange} value={filter === true || filter === "true" ? "" : filter} disabled={isLoading} style={inputStyle} />
                  </Col>
                </div>
            }

            <Row>
              <Col mobile={12} desktop={12} >
                <Operations/>
              </Col>
            </Row>
            <Row>
              <Col mobile={12} desktop={12} >
                <Models/>
              </Col>
            </Row>
          </div>
        </div>
      )
  }
}
