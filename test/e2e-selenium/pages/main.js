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
      selector: ".information-container.wrapper",
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
        httpOption: {
          selector: "select option"
        },
        btnAuthorize: {
          selector: "button.authorize"
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
    },
    apiWrapper: {
      selector: "div.swagger-ui > div:nth-child(2) > div:nth-child(5) > section > div",
      elements: {
        petAPIWrapper: {
          selector: "div.swagger-ui div:nth-child(5) > section > div > span:nth-child(1) > div"
        },
        petAPIWrapperBar: {
          selector: "div.swagger-ui div:nth-child(5) > section > div > span:nth-child(1) > div .opblock-tag"
        },

        /**
         * Post pet/ api
         */
        petOperationPostContainer: {
          selector: "div#operations-pet-addPet"
        },
        petOperationPostTitle: {
          selector: "div#operations-pet-addPet .opblock-summary-post span.opblock-summary-path span"
        },
        petOperationPostCollpase: {
          selector: "div#operations-pet-addPet .opblock-summary-post"
        },
        petOperationPostCollapseContainer: {
          selector: "div#operations-pet-addPet>div:nth-child(2)"
        },
        petOperationPostTryBtn: {
          selector: "div#operations-pet-addPet button.try-out__btn"
        },
        petOperationPostTryText: {
          selector: "div#operations-pet-addPet textarea.body-param__text"
        },
        petOperationPostExecuteBtn: {
          selector: "div#operations-pet-addPet button.execute"
        },
        petOperationPostTryTextArea: {
          selector: "div#operations-pet-addPet textarea"
        },
        petOperationPostResultsBox: {
          selector: "div#operations-pet-addPet pre.microlight"
        },
        petOperationPostMockCategoryID: {
          selector: "div#operations-pet-addPet pre.microlight span:nth-child(17)"
        },
        petOperationPostMockCategoryName: {
          selector: "div#operations-pet-addPet pre.microlight span:nth-child(23)"
        },
        petOperationPostMockName: {
          selector: "div#operations-pet-addPet pre.microlight span:nth-child(31)"
        },
        petOperationPostTagID: {
          selector: "div#operations-pet-addPet pre.microlight span:nth-child(54)"
        },
        petOperationPostTagName: {
          selector: "div#operations-pet-addPet pre.microlight span:nth-child(60)"
        },
        petOperationPostStatus: {
          selector: "div#operations-pet-addPet pre.microlight span:nth-child(70)"
        },

        /**
         * Put pet/ api
         */
        petOperationPutContainer: {
          selector: "div#operations-pet-updatePet"
        },
        petOperationPutTitle: {
          selector: "div#operations-pet-updatePet .opblock-summary-put span.opblock-summary-path span"
        },
        petOperationPutCollpase: {
          selector: "div#operations-pet-updatePet .opblock-summary-put"
        },
        petOperationPutCollapseContainer: {
          selector: "div#operations-pet-updatePet>div:nth-child(2)"
        },
        petOperationPutTryBtn: {
          selector: "div#operations-pet-updatePet button.try-out__btn"
        },
        petOperationPutTryText: {
          selector: "div#operations-pet-updatePet textarea.body-param__text"
        },
        petOperationPutExecuteBtn: {
          selector: "div#operations-pet-updatePet button.execute"
        },
        petOperationPutTryTextArea: {
          selector: "div#operations-pet-updatePet textarea"
        },
        petOperationPutResultsBox: {
          selector: "div#operations-pet-updatePet pre.microlight"
        },
        petOperationPutMockCategoryID: {
          selector: "div#operations-pet-updatePet pre.microlight span:nth-child(17)"
        },
        petOperationPutMockCategoryName: {
          selector: "div#operations-pet-updatePet pre.microlight span:nth-child(23)"
        },
        petOperationPutMockName: {
          selector: "div#operations-pet-updatePet pre.microlight span:nth-child(31)"
        },
        petOperationPutTagID: {
          selector: "div#operations-pet-updatePet pre.microlight span:nth-child(54)"
        },
        petOperationPutTagName: {
          selector: "div#operations-pet-updatePet pre.microlight span:nth-child(60)"
        },
        petOperationPutStatus: {
          selector: "div#operations-pet-updatePet pre.microlight span:nth-child(70)"
        },

        /**
         * Get /pet/findByTags
         */
        petOperationGetByTagContainer: {
          selector: "div#operations-pet-findPetsByTags"
        },
        petOperationGetByTagTitle: {
          selector: "div#operations-pet-findPetsByTags .opblock-summary-get span.opblock-summary-path__deprecated span"
        },
        petOperationGetByTagCollpase: {
          selector: "div#operations-pet-findPetsByTags .opblock-summary-get"
        },
        petOperationGetByTagCollapseContainer: {
          selector: "div#operations-pet-findPetsByTags .ReactCollapse--collapse"
        },
        petOperationGetByTagTryBtn: {
          selector: "div#operations-pet-findPetsByTags button.try-out__btn"
        },
        petOperationGetByTagTryAdded: {
          selector: "div#operations-pet-findPetsByTags button.json-schema-form-item-add"
        },
        petOperationGetByTagExecuteBtn: {
          selector: "div#operations-pet-findPetsByTags button.execute"
        },
        petOperationGetByTagTryTextArea: {
          selector: "div#operations-pet-findPetsByTags textarea"
        },
        petOperationGetByTagResultsBox: {
          selector: "div#operations-pet-findPetsByTags pre.microlight"
        },
        petOperationGetByTagMockCategoryID: {
          selector: "div#operations-pet-findPetsByTags pre.microlight span:nth-child(17)"
        },
        petOperationGetByTagMockCategoryName: {
          selector: "div#operations-pet-findPetsByTags pre.microlight span:nth-child(23)"
        },
        petOperationGetByTagMockName: {
          selector: "div#operations-pet-findPetsByTags pre.microlight span:nth-child(31)"
        },
        petOperationGetByTagTagID: {
          selector: "div#operations-pet-findPetsByTags pre.microlight span:nth-child(54)"
        },
        petOperationGetByTagTagName: {
          selector: "div#operations-pet-findPetsByTags pre.microlight span:nth-child(60)"
        },
        petOperationGetByTagStatus: {
          selector: "div#operations-pet-findPetsByTags pre.microlight span:nth-child(70)"
        },

        /**
         * Get /pet/{petId}
         */
        petOperationGetByIdContainer: {
          selector: "div#operations-pet-getPetById"
        },
        petOperationGetByIdTitle: {
          selector: "div#operations-pet-getPetById .opblock-summary-get span.opblock-summary-path span"
        },
        petOperationGetByIdCollpase: {
          selector: "div#operations-pet-getPetById .opblock-summary-get"
        },
        petOperationGetByIdCollapseContainer: {
          selector: "div#operations-pet-getPetById .ReactCollapse--collapse"
        },
        petOperationGetByIdTryBtn: {
          selector: "div#operations-pet-getPetById button.try-out__btn"
        },
        petOperationGetByIdExecuteBtn: {
          selector: "div#operations-pet-getPetById button.execute"
        },
        petOperationGetByIdParameter: {
          selector: "div#operations-pet-getPetById div.parameters-col_description input"
        },
        petOperationGetByIdResultsBox: {
          selector: "div#operations-pet-getPetById pre.microlight"
        },

        /**
         * Delete pet/
         */
        petOperationDeleteContainer: {
          selector: "div#operations-pet-deletePet"
        },
        petOperationDeleteTitle: {
          selector: "div#operations-pet-deletePet .opblock-summary-delete span.opblock-summary-path span"
        },
        petOperationDeleteCollpase: {
          selector: "div#operations-pet-deletePet .opblock-summary-delete"
        },
        petOperationDeleteCollapseContainer: {
          selector: "div#operations-pet-deletePet>div:nth-child(2)"
        },
        petOperationDeleteTryBtn: {
          selector: "div#operations-pet-deletePet button.try-out__btn"
        },
        petOperationDeleteExecuteBtn: {
          selector: "div#operations-pet-deletePet button.execute"
        },
        petOperationDeleteTryTextArea: {
          selector: "div#operations-pet-deletePet textarea"
        },
        petOperationDeleteResultsBox: {
          selector: "div#operations-pet-deletePet pre.microlight"
        },
        petOperationDeleteMockCategoryID: {
          selector: "div#operations-pet-deletePet pre.microlight span:nth-child(17)"
        },
        petOperationDeleteMockCategoryName: {
          selector: "div#operations-pet-deletePet pre.microlight span:nth-child(23)"
        },
        petOperationDeleteMockName: {
          selector: "div#operations-pet-deletePet pre.microlight span:nth-child(31)"
        },
        petOperationDeleteTagID: {
          selector: "div#operations-pet-deletePet pre.microlight span:nth-child(54)"
        },
        petOperationDeleteTagName: {
          selector: "div#operations-pet-deletePet pre.microlight span:nth-child(60)"
        },
        petOperationDeleteStatus: {
          selector: "div#operations-pet-deletePet pre.microlight span:nth-child(70)"
        },

        /**
         * ***********Store************
         */
        storeAPIWrapper: {
          selector: "div.swagger-ui div:nth-child(5) > section > div > span:nth-child(2) > div"
        },
        storeAPIWrapperBar: {
          selector: "div.swagger-ui div:nth-child(5) > section > div > span:nth-child(2) > div .opblock-tag"
        },
        /**
         * Get /store/inventory
         */
        storeOperationGetContainer: {
          selector: "div#operations-store-getInventory"
        },
        storeOperationGetTitle: {
          selector: "div#operations-store-getInventory .opblock-summary-get span.opblock-summary-path span"
        },
        storeOperationGetCollpase: {
          selector: "div#operations-store-getInventory .opblock-summary-get"
        },
        storeOperationGetCollapseContainer: {
          selector: "div#operations-store-getInventory>div:nth-child(2)"
        },
        storeOperationGetTryBtn: {
          selector: "div#operations-store-getInventory button.try-out__btn"
        },
        storeOperationGetExecuteBtn: {
          selector: "div#operations-store-getInventory button.execute"
        },
        storeOperationResponseProps1: {
          selector: "div#operations-store-getInventory pre.example.microlight span:nth-child(6)"
        },
        storeOperationResponseProps2: {
          selector: "div#operations-store-getInventory pre.example.microlight span:nth-child(12)"
        },
        storeOperationResponseProps3: {
          selector: "div#operations-store-getInventory pre.example.microlight span:nth-child(18)"
        },
        /**
         * Post /store/order
         */
        storeOperationPostContainer: {
          selector: "div#operations-store-placeOrder"
        },
        storeOperationPostTitle: {
          selector: "div#operations-store-placeOrder .opblock-summary-post span.opblock-summary-path span"
        },
        storeOperationPostCollpase: {
          selector: "div#operations-store-placeOrder .opblock-summary-post"
        },
        storeOperationPostCollapseContainer: {
          selector: "div#operations-store-placeOrder>div:nth-child(2)"
        },
        storeOperationPostTryBtn: {
          selector: "div#operations-store-placeOrder button.try-out__btn"
        },
        storeOperationPostExecuteBtn: {
          selector: "div#operations-store-placeOrder button.execute"
        },
        storeOperationPostResponseId: {
          selector: "div#operations-store-placeOrder pre.example.microlight span:nth-child(22)"
        },
        storeOperationPostResponsePetId: {
          selector: "div#operations-store-placeOrder pre.example.microlight span:nth-child(31)"
        },
        storeOperationPostResponseQuantity: {
          selector: "div#operations-store-placeOrder pre.example.microlight span:nth-child(40)"
        },
        storeOperationPostResponseStatus: {
          selector: "div#operations-store-placeOrder pre.example.microlight span:nth-child(66)"
        },
        storeOperationPostResponseComplete: {
          selector: "div#operations-store-placeOrder pre.example.microlight span:nth-child(75)"
        },
        /**
         * Delete /store/order/{orderId}
         */
        storeOperationDeleteContainer: {
          selector: "div#operations-store-deleteOrder"
        },
        storeOperationDeleteTitle: {
          selector: "div#operations-store-deleteOrder .opblock-summary-delete span.opblock-summary-path span"
        },
        storeOperationDeleteCollpase: {
          selector: "div#operations-store-deleteOrder .opblock-summary-delete"
        },
        storeOperationDeleteCollapseContainer: {
          selector: "div#operations-store-deleteOrder>div:nth-child(2)"
        },
        storeOperationDeleteTryBtn: {
          selector: "div#operations-store-deleteOrder button.try-out__btn"
        },
        storeOperationDeleteExecuteBtn: {
          selector: "div#operations-store-deleteOrder button.execute"
        },
        storeOperationGetResponseHeaders: {
          selector: "div#operations-store-deleteOrder pre span"
        },
        /**
         * *********User**************
         */
        userAPIWrapper: {
          selector: "div.swagger-ui div:nth-child(5) > section > div > span:nth-child(3) > div"
        },
        userAPIWrapperBar: {
          selector: "div.swagger-ui div:nth-child(5) > section > div > span:nth-child(3) > div .opblock-tag"
        },
        /**
         * Put /user/login
         */
        userOperationPutContainer: {
          selector: "div#operations-user-updateUser"
        },
        userOperationPutTitle: {
          selector: "div#operations-user-updateUser .opblock-summary-put span.opblock-summary-path span"
        },
        userOperationPutCollpase: {
          selector: "div#operations-user-updateUser .opblock-summary-put"
        },
        userOperationPutCollapseContainer: {
          selector: "div#operations-user-updateUser>div:nth-child(2)"
        },
        userOperationPutTryBtn: {
          selector: "div#operations-user-updateUser button.try-out__btn"
        },
        userOperationPutExecuteBtn: {
          selector: "div#operations-user-updateUser button.execute"
        },
        userOperationPutParameter: {
          selector: "div#operations-user-updateUser div.parameters-col_description input"
        },
        userOperationPutResponseHeader: {
          selector: "div#operations-user-updateUser div.parameters-col_description input"
        },
        /**
         * Delete /user
         */
        userOperationDeleteContainer: {
          selector: "div#operations-user-deleteUser"
        },
        userOperationDeleteTitle: {
          selector: "div#operations-user-deleteUser .opblock-summary-delete span.opblock-summary-path span"
        },
        userOperationDeleteCollpase: {
          selector: "div#operations-user-deleteUser .opblock-summary-delete"
        },
        userOperationDeleteCollapseContainer: {
          selector: "div#operations-user-deleteUser>div:nth-child(2)"
        },
        userOperationDeleteTryBtn: {
          selector: "div#operations-user-deleteUser button.try-out__btn"
        },
        userOperationDeleteExecuteBtn: {
          selector: "div#operations-user-deleteUser button.execute"
        },
        userOperationDeleteParameter: {
          selector: "div#operations-user-deleteUser div.parameters-col_description input"
        },
        userOperationDeleteResponseHeader: {
          selector: "div#operations-user-deleteUser div.parameters-col_description input"
        },

      }
    },
    /* Model Container */
    modelWrapper: {
      selector: "div.swagger-ui > div:nth-child(2) > div:nth-child(5)",
      elements: {
        modelContainer: {
          selector: ".swagger-ui .models"
        },
        modelCollapse: {
          selector: ".swagger-ui .models h4"
        },
        orderModel: {
          selector: "section.models div.model-container:nth-child(1)"
        },
        orderModelCallapse: {
          selector: "section.models div.model-container:nth-child(1) span.model-toggle"
        },
        categoryModel: {
          selector: "section.models div.model-container:nth-child(2)"
        },
        categoryModelCallapse: {
          selector: "section.models div.model-container:nth-child(2) span.model-toggle"
        },
        userModel: {
          selector: "section.models div.model-container:nth-child(3)"
        },
        userModelCallapse: {
          selector: "section.models div.model-container:nth-child(3) span.model-toggle"
        },
        tagModel: {
          selector: "section.models div.model-container:nth-child(4)"
        },
        tagModelCallapse: {
          selector: "section.models div.model-container:nth-child(4) span.model-toggle"
        },
        petModel: {
          selector: "section.models div.model-container:nth-child(5)"
        },
        petModelCallapse: {
          selector: "section.models div.model-container:nth-child(5) span.model-toggle"
        },
        apiResponseModel: {
          selector: "section.models div.model-container:nth-child(6)"
        },
        apiResponseModelCallapse: {
          selector: "section.models div.model-container:nth-child(6) span.model-toggle"
        },
      }
    }
  }
}
