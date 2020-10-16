describe("#6442: 'Examples' keyword definitions can not be rendered as xml", () => {
    it("should render response examples accourdingly to content-type xml", () => {
        const xmlIndicator = "<x>should be xml</x>"

        cy
            .visit("?url=/documents/bugs/6442.yaml")
            .get("#operations-default-xmlTest")
            .click()
            .get(".responses-wrapper")
            .within(() => {
                cy
                    .get(".microlight")
                    .should("include.text", xmlIndicator)
            })
    })
})

describe("#6442: 'Example' keyword definitions can not be rendered as xml", () => {
    it("should render response examples accourdingly to content-type xml", () => {
        const xmlIndicator = "<x>should be xml</x>"

        cy
            .visit("?url=/documents/bugs/6442.yaml")
            .get("#operations-default-xmlTest2")
            .click()
            .get(".responses-wrapper")
            .within(() => {
                cy
                    .get(".microlight")
                    .should("include.text", xmlIndicator)
            })
    })
})
