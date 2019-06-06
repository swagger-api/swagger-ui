import React from "react"
import PropTypes from "prop-types"
import { DropDown, DropDownItem } from "components/layout-utils"


export default class Schemes extends React.Component {

  static propTypes = {
    specActions: PropTypes.object.isRequired,
    schemes: PropTypes.object.isRequired,
    currentScheme: PropTypes.string.isRequired,
    path: PropTypes.string,
    method: PropTypes.string
  }

  componentWillMount() {
    let { schemes } = this.props

    //fire 'change' event to set default 'value' of select
    this.setScheme(schemes.first())
  }

  componentWillReceiveProps(nextProps) {
    if ( !this.props.currentScheme || !nextProps.schemes.includes(this.props.currentScheme) ) {
      // if we don't have a selected currentScheme or if our selected scheme is no longer an option,
      // then fire 'change' event and select the first scheme in the list of options
      this.setScheme(nextProps.schemes.first())
    }
  }

  onChange = ( value ) => {
    this.setScheme( value )
  }

  setScheme = ( value ) => {
    let { path, method, specActions } = this.props

    specActions.setScheme( value, path, method )
  }

  render() {
    let { schemes, currentScheme } = this.props

    return (
      <label htmlFor="schemes">
        <span className="schemes-title">Schemes</span>
        <DropDown displayLable={true} label="Schemes" mod="schemes" onChange={ this.onChange } value={currentScheme}>
          { schemes.valueSeq().map(
            ( scheme ) => <DropDownItem value={ scheme } key={ scheme }>{ scheme }</DropDownItem>
          )}
        </DropDown>
      </label>
    )
  }
}
