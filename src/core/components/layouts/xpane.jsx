import React from "react"
import PropTypes from "prop-types"

export default class XPane extends React.Component {

  render() {
    let { getComponent, specSelectors, specActions, layoutSelectors, layoutActions } = this.props
    let info = specSelectors.info()
    let url = specSelectors.url()
    let showEditor = layoutSelectors.isShown("editor")

    let Info = getComponent("info")
    let Operations = getComponent("operations", true)
    let Overview = getComponent("overview", true)
    let Editor = getComponent("editor", true)
    let Footer = getComponent("footer", true)
    let Header = getComponent("header", true)

    let Container = getComponent("Container")
    let Row = getComponent("Row")
    let Col = getComponent("Col")
    let Button = getComponent("Button")

    let showEditorAction = ()=> layoutActions.show("editor", !showEditor)

    return (
      <Container fullscreen>

        <Header/>

        {
          info && info.size ? <Info version={info.get("version")}
                                    description={info.get("description")}
                                    title={info.get("title")}
                                    url={url}/>
                            : null
        }
        <Button onClick={showEditorAction}>{showEditor ? "Hide" : "Show"} Editor</Button>
        <Button onClick={specActions.formatIntoYaml}>Format contents</Button>

        <Row>

          <Col desktop={3} >
            <Overview/>
          </Col>

          <Col hide={!showEditor} keepContents={true} desktop={5} >
            <Editor/>
          </Col>

          <Col desktop={showEditor ? 4 : 9} >
            <Operations/>
          </Col>

        </Row>

        <Footer></Footer>

      </Container>
    )
  }

}

XPane.propTypes = {
  getComponent: PropTypes.func.isRequired,
  specSelectors: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  layoutSelectors: PropTypes.object.isRequired,
  layoutActions: PropTypes.object.isRequired
}


