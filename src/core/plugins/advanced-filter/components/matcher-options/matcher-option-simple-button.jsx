import React from "react"
import PropTypes from "prop-types"

/* eslint-disable camelcase */

export const MatcherOptionSimpleButton = ({ optionKey, title, text, advancedFilterActions, advancedFilterSelectors }) => {
  const isActive = advancedFilterSelectors.getMatcherOption(optionKey)

  const btnStyle = {
    padding: "5px 10px",
    fontSize: "larger",
  }
  const btnClassNames = ["btn"]
  const makeActiveBtn = style => ({ ...style, color: "#49cc90", borderColor: "#49cc90" })

  let matchCaseBtnStyle
  if (isActive) {
    matchCaseBtnStyle = makeActiveBtn(btnStyle)
  } else {
    matchCaseBtnStyle = { ...btnStyle }
    matchCaseBtnStyle.border = "none"
  }

  const onClick = () => {
    advancedFilterActions.updateMatcherOption(optionKey, !isActive)
    advancedFilterActions.updateFilteredSpec()
  }
  return (
    <button title={title} onClick={onClick} style={matchCaseBtnStyle} type="button"
            className={btnClassNames.join(" ")}>{text}
    </button>
  )
}

MatcherOptionSimpleButton.propTypes = {
  advancedFilterActions: PropTypes.object.isRequired,
  advancedFilterSelectors: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  optionKey: PropTypes.string.isRequired,
}
