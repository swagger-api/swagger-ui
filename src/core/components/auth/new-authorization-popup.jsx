import React from "react"
import PropTypes from "prop-types"

export default class NewAuthorizationPopup extends React.Component {
  close =() => {
    let { authActions } = this.props

    authActions.showDefinitions(false)
  }

  constructor(props) {
    super(props);
    this.state = {
      id: '',
      password: '',
      token: ''
    };
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  login(e) {
    e.preventDefault()

    fetch("https://webqa1.mphrx.com/minerva/api/login", {
      "method": "POST",
      "headers": {
        "api-info": "V2|appVerson|deviceBrand|deviceModel|deviceScreenResolution|deviceOs|deviceOsVersion|deviceNetworkProvider|deviceNetworkType"
      },
      "body": JSON.stringify({
        username: this.state.id,
        password: this.state.password
      })
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          token: response.token
        })
        //this.state.token = response.token
        console.log(this.state.token)
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleChange(changeObject) {
    this.setState(changeObject)
  }

  render() {
    let { authSelectors, authActions, getComponent, errSelectors, specSelectors, fn: { AST = {} } } = this.props
    let definitions = authSelectors.shownDefinitions()
    const Auths = getComponent("auths")
    // if(this.state.token){
    //   return(
    //     <div className="wrapper">
    //       <label>token </label>
    //       <input name="token" id="token" type="text" value={this.state.token} onChange={(e) => this.handleChange({ token: e.target.value })}/>
    //     </div>
    //   )
    // }
    // if(this.state.token){
    //   console.log(this.state.token)
    //   return <Auths token={this.state.token}
    //                 AST={AST}
    //                 definitions={ definitions }
    //                 getComponent={ getComponent }
    //                 errSelectors={ errSelectors }
    //                 authSelectors={ authSelectors }
    //                 authActions={ authActions }
    //                 specSelectors={ specSelectors }/>
    //   definitions.valueSeq().map(( definition, key ) => {
    //     return <Auths token={this.state.token}
    //                   key={ key }
    //                   AST={AST}
    //                   definitions={ definition }
    //                   getComponent={ getComponent }
    //                   errSelectors={ errSelectors }
    //                   authSelectors={ authSelectors }
    //                   authActions={ authActions }
    //                   specSelectors={ specSelectors }/>
    //   })
    // }

    return (
      <div className="dialog-ux">
        <div className="backdrop-ux"></div>
        <div className="modal-ux">
          <div className="modal-dialog-ux">
            <div className="modal-ux-inner">
              <div className="modal-ux-header">
                <h3>Available authorizations</h3>
                <button type="button" className="close-modal" onClick={ this.close }>
                  <svg width="20" height="20">
                    <use href="#close" xlinkHref="#close" />
                  </svg>
                </button>
              </div>
              <div className="modal-ux-content">

                <div className="wrapper">
                  <label>ID </label>
                  <input name="id" id="id" type="text" value={this.state.id} onChange={(e) => this.handleChange({ id: e.target.value })}/>
                </div>
                <div className="wrapper">
                  <label>Password </label>
                  <input name="password" id="password" type="password" value={this.state.password} onChange={(e) => this.handleChange({ password: e.target.value })}/>
                </div>

                <button type="submit" className="btn modal-btn auth authorize button" onClick={(e) => this.login(e)}>Authorize</button>
                <button type="button" className="btn modal-btn auth btn-done button" onClick={ this.close }>Close</button>

                <div className="wrapper">
                  <label>token </label>
                  <input name="token" id="token" type="text" value={this.state.token} onChange={(e) => this.handleChange({ token: e.target.value })}/>
                </div>

                {
                  definitions.valueSeq().map(( definition, key ) => {
                    return <Auths token={this.state.token}
                                  key={ key }
                                  AST={AST}
                                  definitions={ definition }
                                  getComponent={ getComponent }
                                  errSelectors={ errSelectors }
                                  authSelectors={ authSelectors }
                                  authActions={ authActions }
                                  specSelectors={ specSelectors }/>
                  })
                }


              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  static propTypes = {
    fn: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    authSelectors: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    errSelectors: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
  }
}
