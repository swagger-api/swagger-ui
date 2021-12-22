import React from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import PropTypes from "prop-types"
import get from "lodash/get"
import {SyntaxHighlighter, getStyle} from "core/syntax-highlighting"

export class RequestSnippets extends React.Component {
  constructor() {
    super()
    this.state = {
      activeLanguage: this.props?.requestSnippetsSelectors?.getSnippetGenerators()?.keySeq().first(),
      expanded: this.props?.requestSnippetsSelectors?.getDefaultExpanded(),
    }
  }

  static propTypes = {
    request: PropTypes.object.isRequired,
    requestSnippetsSelectors: PropTypes.object.isRequired,
    getConfigs: PropTypes.object.isRequired,
    requestSnippetsActions: PropTypes.object.isRequired,
  }
  render() {
      const {request, getConfigs, requestSnippetsSelectors } = this.props
      const snippetGenerators = requestSnippetsSelectors.getSnippetGenerators()
      const activeLanguage = this.state.activeLanguage || snippetGenerators.keySeq().first()
      const activeGenerator = snippetGenerators.get(activeLanguage)
      const snippet = activeGenerator.get("fn")(request)
      const onGenChange = (key) => {
        const needsChange = activeLanguage !== key
        if(needsChange) {
          this.setState({
            activeLanguage: key
          })
        }
      }
      const style = {
        cursor: "pointer",
        lineHeight: 1,
        display: "inline-flex",
        backgroundColor: "rgb(250, 250, 250)",
        paddingBottom: "0",
        paddingTop: "0",
        border: "1px solid rgb(51, 51, 51)",
        borderRadius: "4px 4px 0 0",
        boxShadow: "none",
        borderBottom: "none"
      }
      const activeStyle = {
        cursor: "pointer",
        lineHeight: 1,
        display: "inline-flex",
        backgroundColor: "rgb(51, 51, 51)",
        boxShadow: "none",
        border: "1px solid rgb(51, 51, 51)",
        paddingBottom: "0",
        paddingTop: "0",
        borderRadius: "4px 4px 0 0",
        marginTop: "-5px",
        marginRight: "-5px",
        marginLeft: "-5px",
        zIndex: "9999",
        borderBottom: "none"
      }
      const getBtnStyle = (key) => {
        if (key === activeLanguage) {
          return activeStyle
        }
        return style
      }
      const config = getConfigs()

      const SnippetComponent = config?.syntaxHighlight?.activated
        ? <SyntaxHighlighter
          language={activeGenerator.get("syntax")}
          className="curl microlight"
          onWheel={function(e) {return this.preventYScrollingBeyondElement(e)}}
          style={getStyle(get(config, "syntaxHighlight.theme"))}
        >
          {snippet}
        </SyntaxHighlighter>
        :
        <textarea readOnly={true} className="curl" value={snippet}></textarea>

    const expanded = this.state.expanded === undefined ? this.props?.requestSnippetsSelectors?.getDefaultExpanded() : this.state.expanded
    return (
        <div>
          <div style={{width: "100%", display: "flex", justifyContent: "flex-start", alignItems: "center", marginBottom: "15px"}}>
            <h4
              style={{ cursor: "pointer" }}
              onClick={() => this.setState({expanded: !expanded})}
            >Snippets</h4>
            <button
              onClick={() => this.setState({expanded: !expanded})}
              style={{ border: "none", background: "none" }}
              title={expanded ? "Collapse operation": "Expand operation"}
            >
              <svg className="arrow" width="10" height="10">
                <use href={expanded ? "#large-arrow-down" : "#large-arrow"} xlinkHref={expanded ? "#large-arrow-down" : "#large-arrow"} />
              </svg>
            </button>
          </div>
          {
            expanded && <div className="curl-command">
              <div style={{paddingLeft: "15px", paddingRight: "10px", width: "100%", display: "flex"}}>
                {
                  snippetGenerators.entrySeq().map(([key, gen]) => {
                    return (<div style={getBtnStyle(key)} className="btn" key={key} onClick={() => onGenChange(key)}>
                      <h4 style={key === activeLanguage ? {color: "white",} : {}}>{gen.get("title")}</h4>
                    </div>)
                  })
                }
              </div>
              <div className="copy-to-clipboard">
                <CopyToClipboard text={snippet}>
                  <button />
                </CopyToClipboard>
              </div>
              <div>
                {SnippetComponent}
              </div>
            </div>
          }
        </div>

      )
  }
}
