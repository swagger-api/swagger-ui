import React from "react"
import PropTypes from "prop-types"
import { List } from "immutable"

export default class Errors extends React.Component {

  static propTypes = {
    editorActions: PropTypes.object,
    errSelectors: PropTypes.object.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
  }

  render() {
    let { editorActions, errSelectors, layoutSelectors, layoutActions, getComponent } = this.props

    const Collapse = getComponent("Collapse")

    if(editorActions && editorActions.jumpToLine) {
      var jumpToLine = editorActions.jumpToLine
    }

    let errors = errSelectors.allErrors()

    // all thrown errors, plus error-level everything else
    let allErrorsToDisplay = errors.filter(err => err.get("type") === "thrown" ? true :err.get("level") === "error")

    if(!allErrorsToDisplay || allErrorsToDisplay.count() < 1) {
      return null
    }

    let isVisible = layoutSelectors.isShown(["errorPane"], true)
    let toggleVisibility = () => layoutActions.show(["errorPane"], !isVisible)

    let sortedJSErrors = allErrorsToDisplay.sortBy(err => err.get("line"))

    return (
      <pre className="errors-wrapper">
        <hgroup className="error">
          <h4 className="errors__title">Errors</h4>
          <button className="btn errors__clear-btn" onClick={ toggleVisibility }>{ isVisible ? "Hide" : "Show" }</button>
        </hgroup>
        <Collapse isOpened={ isVisible } animated >
          <div className="errors">
            { sortedJSErrors.map((err, i) => {
              let type = err.get("type")
              if(type === "thrown" || type === "auth") {
                return <ThrownErrorItem key={ i } error={ err.get("error") || err } jumpToLine={jumpToLine} />
              }
              if(type === "spec") {
                return <SpecErrorItem key={ i } error={ err } jumpToLine={jumpToLine} />
              }
            }) }
          </div>
        </Collapse>
      </pre>
      )
    }
}

const ThrownErrorItem = ( { error, jumpToLine } ) => {
  if(!error) {
    return null
  }
  let errorLine = error.get("line")

  return (
    <div className="error-wrapper">
      { !error ? null :
        <div>
          <h4>{ (error.get("source") && error.get("level")) ?
            toTitleCase(error.get("source")) + " " + error.get("level") : "" }
          { error.get("path") ? <small> at {error.get("path")}</small>: null }</h4>
          <span className="message thrown">
            { error.get("message") }
          </span>
          <div className="error-line">
            { errorLine && jumpToLine ? <a onClick={jumpToLine.bind(null, errorLine)}>Jump to line { errorLine }</a> : null }
          </div>
        </div>
      }
    </div>
    )
  }

const SpecErrorItem = ( { error, jumpToLine } ) => {
  let locationMessage = null

  if(error.get("path")) {
    if(List.isList(error.get("path"))) {
      locationMessage = <small>at { error.get("path").join(".") }</small>
    } else {
      locationMessage = <small>at { error.get("path") }</small>
    }
  } else if(error.get("line") && !jumpToLine) {
    locationMessage = <small>on line { error.get("line") }</small>
  }

  return (
    <div className="error-wrapper">
      { !error ? null :
        <div>
          <h4>{ toTitleCase(error.get("source")) + " " + error.get("level") }&nbsp;{ locationMessage }</h4>
          <span className="message">{ error.get("message") }</span>
          <div className="error-line">
            { jumpToLine ? (
              <a onClick={jumpToLine.bind(null, error.get("line"))}>Jump to line { error.get("line") }</a>
            ) : null }
          </div>
        </div>
      }
    </div>
    )
  }

function toTitleCase(str) {
  return (str || "")
    .split(" ")
    .map(substr => substr[0].toUpperCase() + substr.slice(1))
    .join(" ")
}

ThrownErrorItem.propTypes = {
  error: PropTypes.object.isRequired,
  jumpToLine: PropTypes.func
}

ThrownErrorItem.defaultProps = {
  jumpToLine: null
}

SpecErrorItem.propTypes = {
  error: PropTypes.object.isRequired,
  jumpToLine: PropTypes.func
}
