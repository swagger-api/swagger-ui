import React, { PropTypes } from "react"
import ImPropTypes from "react-immutable-proptypes"
import { fromJS } from "immutable"

const noop = ()=>{}

export default class ContentType extends React.Component {

  static propTypes = {
    contentTypes: PropTypes.oneOfType([ImPropTypes.list, ImPropTypes.set]),
    value: PropTypes.string,
    onChange: PropTypes.func,
    className: PropTypes.string
  }

  static defaultProps = {
    onChange: noop,
    value: null,
    contentTypes: fromJS(["application/json"]),
  }

  componentDidMount() {
    // Needed to populate the form, initially
    this.props.onChange(this.props.contentTypes.first())
  }

  onChangeWrapper = e => this.props.onChange(e.target.value)

  render() {
    let { contentTypes, className, value } = this.props

    if ( !contentTypes || !contentTypes.size )
      return null

    return (
      <div className={ "content-type-wrapper " + ( className || "" ) }>
        <select className="content-type" value={value} onChange={this.onChangeWrapper} >
          { contentTypes.map( (val) => {
            return <option key={ val } value={ val }>{ val }</option>
          }).toArray()}
        </select>
      </div>
    )
  }
}
