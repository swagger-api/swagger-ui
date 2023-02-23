describe("When trying it out", () => {
  it("should render the response headers as comma separated lists", () => {
    cy.intercept(
      {
        method: "GET",
        url: /^\/response-headers/,
        hostname: "httpbin.org",
      },
      {
        body: {
          "Access-Control-Expose-Headers": "X-Header1, X-Header2, X-Header3, Access-Control-Expose-Headers",
          "Content-Length": "289",
          "Content-Type": "application/json",
          "X-Header1": "value1,value2",
          "X-Header2": "value3,value4",
          "X-Header3": ["value5", "value6"]
        },
        headers: {
          "access-control-expose-headers": "X-Header1,X-Header2,X-Header3,Access-Control-Expose-Headers",
          "content-type": "application/json",
          "x-header1": "value1,value2",
          "x-header2": "value3,value4",
          "x-header3": "value5,value6",
        }
    })

    cy.visit("/?url=/documents/bugs/6183.yaml")
      .get("#operations-default-get_response_headers")
      .click()
      .get(".try-out__btn")
      .click()
      .get(".btn.execute")
      .click()
      .wait(1000)
      .get(".response-col_description .microlight")
      .find(("span:contains(\"value1,value2\")"))
      .should("exist")
      .get(".response-col_description .microlight")
      .find(("span:contains(\"value3,value4\")"))
      .should("exist")
      .get(".response-col_description .microlight")
      .find(("span:contains(\"value5,value6\")"))
      .should("exist")
  })
})
