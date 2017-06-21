module.exports = {
  sections: {
    topbar: {
      selector: ".topbar",
      elements: {
        inputBox: {
          selector: "input"
        },
        btnExplore: {
          selector: "button"
        }
      }
    },
    informationContainer: {
      selector: ".information-container",
      elements: {
        title: {
          selector: ".title"
        },
        version: {
          selector: ".version"
        },
        baseUrl: {
          selector: ".base-url"
        },
        mainUrl: {
          selector: ".main a"
        },
        mainUrlContent: {
          selector: ".main a span"
        },
        description: {
          selector: ".description p"
        },
        swaggerUrl: {
          selector: ".description p a:nth-of-type(1)"
        },
        swaggerircUrl: {
          selector: ".description p a:nth-of-type(2)"
        },
        termsLink: {
          selector: ".info > div:nth-child(3) a"
        },
        contactDevLink: {
          selector: ".info > div:nth-child(4) a"
        },
        apacheLink: {
          selector: ".info > div:nth-child(5) a"
        },
        aboutSwaggerLink: {
          selector: ".info > a"
        }
      }
    }
  }
}
