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
    },
    schemeContainer: {
      selector: ".scheme-container",
      elements: {
        schemeTitle: {
          selector: ".schemes-title"
        },
        httpOption: {
          selector: "select option"
        },
        btnAuthorize: {
          selector: "button"
        },
        authorizationModal: {
          selector: ".dialog-ux"
        },
        appName: {
          selector: ".auth-container h5"
        },
        authorizationUrl: {
          selector: ".auth-container code"
        },
        flow: {
          selector: ".flow code"
        },
        inputClientID: {
          selector: "#client_id"
        },
        checkWritePetStoreAuth: {
          selector: "#write:pets-checkbox-petstore_auth"
        },
        checkReadPetStoreAuth: {
          selector: "#read:pets-checkbox-petstore_auth"
        }
      }
    }
  }
}
