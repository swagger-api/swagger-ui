import React from "react"
import PropTypes from "prop-types"

class Sidebar extends React.Component {
  static propTypes = {
    taggedOps: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    onTagClick: PropTypes.func.isRequired,
  }

  handleTagClick = (tag) => {
    const element = document.getElementById(`operations-tag-${tag.name}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  render() {
    const { taggedOps } = this.props

    if(taggedOps.length === 0) {
      return <h3>No operations defined in spec!</h3>
    }

    return (
      <div className="sidebar">
        <div className="menu">
          {taggedOps.map((tag) => (
            <span
              key={tag.name}
              className="menu-item"
              id={tag.name}
              onClick={() => this.handleTagClick(tag)}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    )
  }
}

export default Sidebar
