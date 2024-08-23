import React from "react"
import PropTypes from "prop-types"

class Sidebar extends React.Component {
  static propTypes = {
    taggedOps: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired
      })
    ).isRequired,
    onTagClick: PropTypes.func.isRequired
  }


  render() {
    const { taggedOps, onTagClick } = this.props

    if(taggedOps.size === 0) {
      return <h3> No operations defined in spec!</h3>
    }

    return (
      <>
      <div className="sidebar">
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }} className="menu">
          {taggedOps.map((tag) => (
            <span
              key={tag.name}
              className="menu"
              id={tag.name}
              onClick={() => onTagClick(tag)}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
      </>
    )
  }
}

export default Sidebar

