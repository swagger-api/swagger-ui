import React from "react"
import PropTypes from "prop-types"
import { isFunc } from "../utils"

export default class FilterContainer extends React.Component {
  constructor() {
    super()
    this.state = {
      savedCursorOffset: 0,
    }
  }

  static propTypes = {
    specSelectors: PropTypes.object.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
  }

  componentDidMount() {
    if (this.inputRef) {
      const filter = this.props.layoutSelectors.currentFilter()
      this.inputRef.innerText = filter === true || filter === "true" ? "" : filter
      this.inputRef.addEventListener("keypress", e => {
        if (e.key === "Enter") {
          e.preventDefault()
        }
      })
      this.inputRef.addEventListener("paste", (e) => {
        const content = e.clipboardData.getData("text/plain")
        document.execCommand("insertText", false, content
          .replace(/\r?\n|\r/g, "")
          .replace(new RegExp(String.fromCharCode(160), "g"), " "))
        e.preventDefault()
        return false
      })
    }
  }

  getFilterConfig = () => {
    const configMap = this.props.layoutSelectors.currentFilterConfig()
    if (isFunc(configMap.toJS)) {
      return configMap.toJS()
    }
    return configMap
  }

  onFilterChange = (e) => {
    if (this.inputRef.innerHTML.trim() === "<br>") {
      this.inputRef.innerHTML = ""
    }
    this.setState({ savedCursorOffset: document.getSelection().focusOffset })
    const { target: { innerText } } = e
    this.props.layoutActions.updateFilter(innerText)
  }
  onRegexToggle = () => {
    const currentFilterConfig = this.getFilterConfig()
    this.props.layoutActions.updateFilterConfig({
      ...currentFilterConfig,
      matchWords: false,
      isRegexFilter: !currentFilterConfig.isRegexFilter,
    })
    this.restoreInputFocus()
  }

  restoreInputFocus() {
    this.inputRef.focus()
    if (this.state.savedCursorOffset !== undefined) {
      document.getSelection().collapse(this.inputRef.firstChild, this.state.savedCursorOffset)
    }
  }

  onMatchCaseToggle = () => {
    const currentFilterConfig = this.getFilterConfig()
    this.props.layoutActions.updateFilterConfig({
      ...currentFilterConfig,
      matchCase: !currentFilterConfig.matchCase,
    })
    this.restoreInputFocus()
  }

  onMatchWordsToggle = () => {
    const currentFilterConfig = this.getFilterConfig()
    this.props.layoutActions.updateFilterConfig({
      ...currentFilterConfig,
      matchWords: !currentFilterConfig.matchWords,
    })
    this.restoreInputFocus()
  }

  onSearchLocationChange = (locationOption) => {
    const currentFilterConfig = this.getFilterConfig()
    this.props.layoutActions.updateFilterConfig({
      ...currentFilterConfig,
      searchLocation: locationOption.target.value,
    })
    this.restoreInputFocus()
  }

  moveCaret(win, charCount) {
    let sel, range
    if (win.getSelection) {
      // IE9+ and other browsers
      sel = win.getSelection()
      if (sel.rangeCount > 0) {
        const textNode = this.inputRef.firstChild
        const newOffset = sel.focusOffset + charCount
        sel.collapse(textNode, Math.min(textNode.length, newOffset))
      }
    } else if ((sel = win.document.selection)) {
      // IE <= 8
      if (sel.type !== "Control") {
        range = sel.createRange()
        range.move("character", charCount)
        range.select()
      }
    }
    this.setState({ savedCursorOffset: document.getSelection().focusOffset })
  }

  render() {
    const { specSelectors, layoutSelectors, getComponent } = this.props
    const Col = getComponent("Col")

    const isLoading = specSelectors.loadingStatus() === "loading"
    const isFailed = specSelectors.loadingStatus() === "failed"
    const filter = layoutSelectors.currentFilter()
    const filterConfig = this.getFilterConfig()
    const isRegexFilter = filterConfig.isRegexFilter

    const formStyle = {
      display: "flex",
      flexDirection: "row",
      border: "1px solid grey",
      margin: "20px 0",
      background: "white",
      padding: "5px",
    }

    const inputStyle = {
      flexShrink: 1,
      padding: "0px !important",
      border: "none",
      margin: 0,
      overflow: "overlay",
      outline: "none",
    }

    const btnStyle = {
      marginRight: "5px",
      padding: "5px 10px",
      fontSize: "larger",
    }

    const separatorStyle = {
      flexGrow: 1,
      margin: "0 5px",
      borderRight: "1px solid grey",
    }

    const regexPreAndSuffixStyle = {
      height: "100%",
      fontSize: "larger",
      color: "grey",
      alignSelf: "center",
    }

    const btnClassNames = ["btn"]

    const classNames = ["operation-filter-input"]
    if (isFailed) classNames.push("failed")
    if (isLoading) classNames.push("loading")

    const makeActiveBtn = style => ({ ...style, color: "#49cc90", borderColor: "#49cc90" })

    let regexBtnStyle
    if (isRegexFilter) {
      regexBtnStyle = makeActiveBtn(btnStyle)
    } else {
      regexBtnStyle = { ...btnStyle }
      regexBtnStyle.border = "none"
    }

    let matchCaseBtnStyle
    if (filterConfig.matchCase) {
      matchCaseBtnStyle = makeActiveBtn(btnStyle)
    } else {
      matchCaseBtnStyle = { ...btnStyle }
      matchCaseBtnStyle.border = "none"
    }

    let matchWordsBtnStyle
    if (filterConfig.matchWords) {
      matchWordsBtnStyle = makeActiveBtn(btnStyle)
    } else {
      matchWordsBtnStyle = { ...btnStyle }
      matchWordsBtnStyle.border = "none"
    }

    return (
      <div>
        {filter === null || filter === false || filter === "false" ? null :
          <div className="filter-container">
            <Col className="filter wrapper" mobile={12}>
              <form style={formStyle}>
                {isRegexFilter && (
                  <div style={{ ...regexPreAndSuffixStyle, marginLeft: "5px" }}>
                    /
                  </div>
                )}
                <span ref={(r) => this.getRef(r)} role={"textbox"} contentEditable={!isLoading} style={inputStyle}
                      className={classNames.join(" ")} placeholder={`Filter by ${filterConfig.searchLocation}`}
                      onClick={() => this.setState({ savedCursorOffset: document.getSelection().focusOffset })}
                      onFocus={() => this.setState({ savedCursorOffset: document.getSelection().focusOffset })}
                      onInput={this.onFilterChange} />
                {isRegexFilter && (
                  <div style={{ ...regexPreAndSuffixStyle, marginRight: "5px" }}>
                    /{!filterConfig.matchCase ? "i" : null}
                  </div>
                )}
                <div style={separatorStyle} onClick={() => {
                  this.inputRef.focus()
                  this.moveCaret(document, filter.length)
                }} />
                <button title="Match Case" onClick={this.onMatchCaseToggle} style={matchCaseBtnStyle} type="button"
                        className={btnClassNames.join(" ")}>Aa
                </button>
                <button disabled={isRegexFilter} title="Match Whole Word" onClick={this.onMatchWordsToggle}
                        style={matchWordsBtnStyle} type="button"
                        className={btnClassNames.join(" ")}>W
                </button>
                <button title="Use Regular Expression" onClick={this.onRegexToggle} style={regexBtnStyle}
                        type="button"
                        className={btnClassNames.join(" ")}>.*
                </button>
                <select className="location-select" value={filterConfig.searchLocation} onChange={this.onSearchLocationChange}>
                  <option value="tag">tag</option>
                  <option value="route">route</option>
                </select>
              </form>
            </Col>
          </div>
        }
      </div>
    )
  }

  getRef(r) {
    this.inputRef = r
  }
}
