import React from "react"
import PropTypes from "prop-types"

export default class FeaturesPopupButton extends React.Component {
  constructor() {
    super()
    this.state = {
      isOpen: false,
    }
  }

  close = () => {
    this.setState({ isOpen: false })
  }

  reset = () => {
    this.props.featuresActions.resetFeatures()
  }

  render() {
    const { getComponent, featuresSelectors, featuresActions, fn } = this.props
    const Button = getComponent("Button")
    const Popup = getComponent("Popup")

    return (<div className="features">
        <button className="features-btn btn" onClick={() => this.setState({ isOpen: true })}>Features
        </button>
        {
          this.state.isOpen && <Popup title={"Available Features"} onClose={this.close}>
            <div className="feature-list">
              {
                featuresSelectors.getPreviewFeatures().map((feature, key) => {
                  const onClick = () => {
                    featuresActions.toggleFeature(key)
                    featuresActions.persistFeatures()
                  }
                  const checked = featuresSelectors.isFeatureEnabled(key)
                  const AdditionalSettings = fn.getSettingsComponent(key)
                  const info = feature.get("info")
                  return <div className="feature-item" key={"feature-item-" + key}>
                    <label className="feature-item-option">
                      <input className="feature-item-option-checkbox" onChange={onClick} type="checkbox" checked={checked} />
                      <div className="feature-item-detail">
                        <h4>{info.get("title")}</h4>
                        {info.get("description")}
                        {
                          AdditionalSettings && (
                            <div>
                              <h5>Settings</h5>
                              <div className="feature-item-settings">
                                <AdditionalSettings/>
                              </div>
                            </div>
                          )
                        }
                      </div>
                    </label>
                    <div className="seperator"></div>
                  </div>
                }).toArray()
              }
              <div className="modal-actions">
                <Button className="btn" onClick={ this.reset }>Reset</Button>
                <Button className="btn" onClick={ this.close }>Close</Button>
              </div>
            </div>
          </Popup>
        }
      </div>
    )
  }

  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    featuresSelectors: PropTypes.object.isRequired,
    featuresActions: PropTypes.object.isRequired,
    fn: PropTypes.object.isRequired,
  }
}
