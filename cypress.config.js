const { defineConfig } = require("cypress")

const startOAuthServer = require("./test/e2e-cypress/support/helpers/oauth2-server")
const startQueryMethodServer = require("./test/e2e-cypress/support/helpers/query-method-server")

module.exports = defineConfig({
  fileServerFolder: "test/e2e-cypress/static",
  fixturesFolder: "test/e2e-cypress/fixtures",
  screenshotsFolder: "test/e2e-cypress/screenshots",
  videosFolder: "test/e2e-cypress/videos",
  video: false,
  e2e: {
    baseUrl: "http://localhost:3230/",
    supportFile: "test/e2e-cypress/support/e2e.js",
    specPattern: "test/e2e-cypress/e2e/**/*.cy.{js,jsx}",
    setupNodeEvents: () => {
      startOAuthServer()
      startQueryMethodServer()
    },
  },
})
