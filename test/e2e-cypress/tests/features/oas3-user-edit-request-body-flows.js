function getExpandedTryout(page = null, operationId = "#operations-pet-addPet") {
  return (page || cy.visit(
    "/?url=/documents/features/petstore-only-pet.openapi.yaml",
  ))
    .get(operationId)
    .click()
    // Expand Try It Out
    .get(".try-out__btn")
    .click()
}

const getRequestBodyFromCY = (page = null, operationId = "#operations-pet-addPet") =>
  getExpandedTryout(page, operationId)
    // get textarea
    .get(".opblock-body .opblock-section .opblock-section-request-body .body-param textarea")

const xmlIndicator = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
const userEditXmlSample = xmlIndicator +
  "<pet>\n" +
  "\t<id>420</id>\n" +
  "\t<name>doggie<3</name>\n" +
  "\t<category>\n" +
  "\t\t<id>99999999999</id>\n" +
  "\t\t<name>Dogiiiiiiiieeee</name>\n" +
  "\t</category>\n" +
  "\t<photoUrls>\n" +
  "\t\t<photoUrl>string</photoUrl>\n" +
  "\t</photoUrls>\n" +
  "\t<tags>\n" +
  "\t\t<tag>\n" +
  "\t\t\t<id>0</id>\n" +
  "\t\t\t<name>string</name>\n" +
  "\t\t</tag>\n" +
  "\t</tags>\n" +
  "\t<status>available</status>\n" +
  "</pet>"

describe("OAS3 Request Body user edit flows", () => {
  // Case: Copy xml from email, paste into request body editor, change media-type to xml
  it("it should never overwrite user edited value in case of media-type change", () => {
    getRequestBodyFromCY()
      // replace default sample with xml edited value
      .type(`{selectall}${userEditXmlSample}`)
      // change media type to xml, because I have forgotten it
      .get(".opblock-section .opblock-section-request-body .body-param-content-type > select")
      .select("application/xml")
      // Ensure user edited body is not overwritten
      .get(".opblock-section-request-body")
      .within(() => {
        cy
          .get("textarea")
          .should(($div) => {
            expect($div.get(0).textContent).to.eq(userEditXmlSample)
          })
      })
  })
  // Case: User really wants to try out the brand new xml content-type
  it("it should overwrite default value in case of content-type change, even within request body editor(#6836)", () => {
    getRequestBodyFromCY()
      // change media type to xml, because I have forgotten it (sry really wanted to try out the new xml content-type)
      .get(".opblock-section .opblock-section-request-body .body-param-content-type > select")
      .select("application/xml")
      // Ensure default value is xml after content type change
      .get(".opblock-section-request-body")
      .within(() => {
        cy
          .get("textarea")
          .should(($div) => {
            expect($div.get(0).textContent).to.contain(xmlIndicator)
          })
      })
  })
  // Case: User wants to get the default value back
  it("it reset the user edited value and render the default value in case of try out reset. (#6517)", () => {
    getRequestBodyFromCY()
      // replace default sample with bad value
      .type("{selectall}ups that should not have happened")
      // Cancel Try It Out
      .get(".try-out__btn.reset")
      .click()
      // Ensure default value is xml after content type change
      .get(".opblock-section-request-body")
      .within(() => {
        cy
          .get("textarea")
          .should(($div) => {
            expect($div.get(0).textContent).to.not.contain("ups that should not have happened")
          })
      })
  })
  describe("multipart/", () => {
    // Case: User wants to execute operation with media-type multipart/ with a enum property. The user expects the first enum value to be used when executed.
    it("should use the first enum value on execute if not changed by user (#6976)", () => {
      // test/e2e-cypress/static/documents/features/request-body/multipart/enum.yaml
      getExpandedTryout(
        cy.visit(
          "/?url=/documents/features/request-body/multipart/enum.yaml",
        ), "#operations-default-post_test")
        .get(".execute")
        .click()
        // Assert on the request URL
        .get(".curl")
        .contains("test_enum=A")
    })
  })
})
