describe("#10591: deep-linking with document <base href> should not replace current route", () => {
  const baseUrl = "/?deepLinking=true&url=/documents/features/deep-linking.openapi.yaml"

  it("should preserve the page pathname and search when an operation is expanded", () => {
    cy.intercept(
      {
        method: "GET",
        pathname: "/",
      },
      (req) => {
        req.continue((res) => {
          if (typeof res.body === "string" && res.body.includes("</head>")) {
            res.body = res.body.replace("</head>", "<base href=\"/\">\n</head>")
          }
        })
      }
    ).as("indexHtml")

    cy.visit(baseUrl)
    cy.wait("@indexHtml")
    cy.get(".opblock-get").first().click()

    cy.location().should((loc) => {
      // The URL hash must change to reflect the deep link...
      expect(loc.hash).to.not.equal("")
      // ...but the pathname (and search) must NOT have been replaced by the
      // browser resolving "#..." against the document <base href="/">.
      expect(loc.pathname).to.equal("/")
      expect(loc.search).to.contain("deepLinking=true")
      expect(loc.search).to.contain("url=/documents/features/deep-linking.openapi.yaml")
    })
  })
})
