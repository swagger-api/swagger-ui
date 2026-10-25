describe("#5138: unwanted `url`/`urls` interactions", () => {
  it("should stably render the first `urls` entry", () => {
    cy
      .visit("/pages/5138/")
      .get("h2.title")
      .contains("USPTO Data Set API")
      .wait(3000)
      .contains("USPTO Data Set API")
  })
})
