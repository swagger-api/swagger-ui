describe("#5060: unwanted smart quotes in rendered Markdown", () => {
  it("should not convert regular quotes to smart quotes", () => {
    cy
      .visit("/?url=/documents/bugs/5060.yaml")
      .get("div.description")
      .should($el => {
        const text = $el.get(0).textContent
        expect(text).to.include(`Example of a simple GET request via curl with bearer HTTP Authentication`)
        expect(text).to.include(`curl -X GET "https://foobar.com/stuff"`)
        expect(text).to.include(`-H "Accept: application/json"`)
        expect(text).to.include(`-H "Authorization: Bearer abc123.xyz.789"`)
        expect(text.indexOf(`“`)).to.equal(-1)
      })
  })
})
