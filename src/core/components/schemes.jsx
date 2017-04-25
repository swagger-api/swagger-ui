import React, { PropTypes } from "react"

export default class Schemes extends React.Component {

  static propTypes = {
    specActions: PropTypes.object.isRequired,
    schemes: PropTypes.object.isRequired,
    path: PropTypes.string,
    method: PropTypes.string
  }

  componentWillMount() {
    let { schemes } = this.props

    //fire 'change' event to set default 'value' of select
    this.setScheme(schemes.first())
  }

  onChange =( e ) => {
    this.setScheme( e.target.value )
  }

  setScheme =( value ) => {
    let { path, method, specActions } = this.props

    specActions.setScheme( value, path, method )
  }

  render() {
    let { schemes } = this.props

    return (
      <label htmlFor="schemes">
        <span className="schemes-title">Schemes</span>
        <select onChange={ this.onChange }>
          { schemes.valueSeq().map(
            ( scheme ) => <option value={ scheme } key={ scheme }>{ scheme }</option>
          ).toArray()}
        </select>
      </label>
    )
  }
}
