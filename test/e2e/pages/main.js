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
      selector: ".swagger-ui .wrapper:nth-child(3)",
      elements: {
        petAPIWrapper: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1)"
        },
        petAPIWrapperBar: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) .opblock-tag"
        },
        /**
         * Post pet/ api
         */
        petOperationPostContainer: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-addPet"
        },
        petOperationPostTitle: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-addPet .opblock-summary-post span.opblock-summary-path span"
        },
        petOperationPostCollpase: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-addPet .opblock-summary-post"
        },
        petOperationPostCollapseContainer: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-addPet>div:nth-child(2)"
        },
        petOperationPostTryBtn: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-addPet button.try-out__btn"
        },
        petOperationPostTryText: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-addPet textarea.body-param__text"
        },
        petOperationPostExecuteBtn: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-addPet button.execute"
        },
        petOperationPostTryTextArea: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-addPet textarea"
        },
        petOperationPostResultsBox: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-addPet pre.microlight"
        },
        petOperationPostMockCategoryID: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-addPet pre.microlight span:nth-child(17)"
        },
        petOperationPostMockCategoryName: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-addPet pre.microlight span:nth-child(23)"
        },
        petOperationPostMockName: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-addPet pre.microlight span:nth-child(31)"
        },
        petOperationPostTagID: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-addPet pre.microlight span:nth-child(54)"
        },
        petOperationPostTagName: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-addPet pre.microlight span:nth-child(60)"
        },
        petOperationPostStatus: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-addPet pre.microlight span:nth-child(70)"
        },
        /**
         * Put pet/ api
         */
        petOperationPutContainer: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-updatePet"
        },
        petOperationPutTitle: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-updatePet .opblock-summary-put span.opblock-summary-path span"
        },
        petOperationPutCollpase: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-updatePet .opblock-summary-put"
        },
        petOperationPutCollapseContainer: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-updatePet>div:nth-child(2)"
        },
        petOperationPutTryBtn: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-updatePet button.try-out__btn"
        },
        petOperationPutTryText: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-updatePet textarea.body-param__text"
        },
        petOperationPutExecuteBtn: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-updatePet button.execute"
        },
        petOperationPutTryTextArea: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-updatePet textarea"
        },
        petOperationPutResultsBox: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-updatePet pre.microlight"
        },
        petOperationPutMockCategoryID: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-updatePet pre.microlight span:nth-child(17)"
        },
        petOperationPutMockCategoryName: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-updatePet pre.microlight span:nth-child(23)"
        },
        petOperationPutMockName: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-updatePet pre.microlight span:nth-child(31)"
        },
        petOperationPutTagID: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-updatePet pre.microlight span:nth-child(54)"
        },
        petOperationPutTagName: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-updatePet pre.microlight span:nth-child(60)"
        },
        petOperationPutStatus: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-updatePet pre.microlight span:nth-child(70)"
        },
        /**
         * Get pet/
         */
        petOperationGetByTagContainer: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-findPetsByTags"
        },
        petOperationGetByTagTitle: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-findPetsByTags .opblock-summary-get span.opblock-summary-path__deprecated span"
        },
        petOperationGetByTagCollpase: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-findPetsByTags .opblock-summary-get"
        },
        petOperationGetByTagCollapseContainer: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-findPetsByTags .ReactCollapse--collapse"
        },
        petOperationGetByTagTryBtn: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-findPetsByTags button.try-out__btn"
        },
        petOperationGetByTagTryAdded: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-findPetsByTags button.json-schema-form-item-add"
        },
        petOperationGetByTagExecuteBtn: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-findPetsByTags button.execute"
        },
        petOperationGetByTagTryTextArea: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-findPetsByTags textarea"
        },
        petOperationGetByTagResultsBox: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-findPetsByTags pre.microlight"
        },
        petOperationGetByTagMockCategoryID: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-findPetsByTags pre.microlight span:nth-child(17)"
        },
        petOperationGetByTagMockCategoryName: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-findPetsByTags pre.microlight span:nth-child(23)"
        },
        petOperationGetByTagMockName: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-findPetsByTags pre.microlight span:nth-child(31)"
        },
        petOperationGetByTagTagID: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-findPetsByTags pre.microlight span:nth-child(54)"
        },
        petOperationGetByTagTagName: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-findPetsByTags pre.microlight span:nth-child(60)"
        },
        petOperationGetByTagStatus: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-findPetsByTags pre.microlight span:nth-child(70)"
        },
        
        /**
         * Delete pet/
         */
        petOperationDeleteContainer: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-deletePet"
        },
        petOperationDeleteTitle: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-deletePet .opblock-summary-delete span.opblock-summary-path span"
        },
        petOperationDeleteCollpase: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-deletePet .opblock-summary-delete"
        },
        petOperationDeleteCollapseContainer: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-deletePet>div:nth-child(2)"
        },
        petOperationDeleteTryBtn: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-deletePet button.try-out__btn"
        },
        petOperationDeleteExecuteBtn: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-deletePet button.execute"
        },
        petOperationDeleteTryTextArea: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-deletePet textarea"
        },
        petOperationDeleteResultsBox: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-deletePet pre.microlight"
        },
        petOperationDeleteMockCategoryID: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-deletePet pre.microlight span:nth-child(17)"
        },
        petOperationDeleteMockCategoryName: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-deletePet pre.microlight span:nth-child(23)"
        },
        petOperationDeleteMockName: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-deletePet pre.microlight span:nth-child(31)"
        },
        petOperationDeleteTagID: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-deletePet pre.microlight span:nth-child(54)"
        },
        petOperationDeleteTagName: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-deletePet pre.microlight span:nth-child(60)"
        },
        petOperationDeleteStatus: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(1) div#operations-pet-deletePet pre.microlight span:nth-child(70)"
        },

        /**
         * ***********Store************
         */
        storeAPIWrapper: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2)"
        },
        storeAPIWrapperBar: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) .opblock-tag"
        },
        /**
         * Get /store/inventory
         */
        storeOperationGetContainer: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) div#operations-store-getInventory"
        },
        storeOperationGetTitle: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) div#operations-store-getInventory .opblock-summary-get span.opblock-summary-path span"
        },
        storeOperationGetCollpase: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) div#operations-store-getInventory .opblock-summary-get"
        },
        storeOperationGetCollapseContainer: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) div#operations-store-getInventory>div:nth-child(2)"
        },
        storeOperationGetTryBtn: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) div#operations-store-getInventory button.try-out__btn"
        },
        storeOperationGetExecuteBtn: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) div#operations-store-getInventory button.execute"
        },
        storeOperationResponseProps1: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) div#operations-store-getInventory pre.example.microlight span:nth-child(6)"
        },
        storeOperationResponseProps2: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) div#operations-store-getInventory pre.example.microlight span:nth-child(12)"
        },
        storeOperationResponseProps3: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) div#operations-store-getInventory pre.example.microlight span:nth-child(18)"
        },
        /**
         * Post /store/order
         */
        storeOperationPostContainer: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) div#operations-store-placeOrder"
        },
        storeOperationPostTitle: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) div#operations-store-placeOrder .opblock-summary-post span.opblock-summary-path span"
        },
        storeOperationPostCollpase: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) div#operations-store-placeOrder .opblock-summary-post"
        },
        storeOperationPostCollapseContainer: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) div#operations-store-placeOrder>div:nth-child(2)"
        },
        storeOperationPostTryBtn: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) div#operations-store-placeOrder button.try-out__btn"
        },
        storeOperationPostExecuteBtn: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) div#operations-store-placeOrder button.execute"
        },
        storeOperationPostResponseId: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) div#operations-store-placeOrder pre.example.microlight span:nth-child(22)"
        },
        storeOperationPostResponsePetId: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) div#operations-store-placeOrder pre.example.microlight span:nth-child(31)"
        },
        storeOperationPostResponseQuantity: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) div#operations-store-placeOrder pre.example.microlight span:nth-child(40)"
        },
        storeOperationPostResponseStatus: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) div#operations-store-placeOrder pre.example.microlight span:nth-child(66)"
        },
        storeOperationPostResponseComplete: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) div#operations-store-placeOrder pre.example.microlight span:nth-child(75)"
        },
        /**
         * Delete /store/order/{orderId}
         */
        storeOperationDeleteContainer: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) div#operations-store-deleteOrder"
        },
        storeOperationDeleteTitle: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) div#operations-store-deleteOrder .opblock-summary-delete span.opblock-summary-path span"
        },
        storeOperationDeleteCollpase: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) div#operations-store-deleteOrder .opblock-summary-delete"
        },
        storeOperationDeleteCollapseContainer: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) div#operations-store-deleteOrder>div:nth-child(2)"
        },
        storeOperationDeleteTryBtn: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) div#operations-store-deleteOrder button.try-out__btn"
        },
        storeOperationDeleteExecuteBtn: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) div#operations-store-deleteOrder button.execute"
        },
        storeOperationGetResponseHeaders: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(2) div#operations-store-deleteOrder pre span"
        },
        /**
         * *********User**************
         */
        userAPIWrapper: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(3)"
        },
        userAPIWrapperBar: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(3) .opblock-tag"
        },
        /**
         * Put /user/login
         */
        userOperationPutContainer: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(3) div#operations-user-updateUser"
        },
        userOperationPutTitle: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(3) div#operations-user-updateUser .opblock-summary-put span.opblock-summary-path span"
        },
        userOperationPutCollpase: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(3) div#operations-user-updateUser .opblock-summary-put"
        },
        userOperationPutCollapseContainer: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(3) div#operations-user-updateUser>div:nth-child(2)"
        },
        userOperationPutTryBtn: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(3) div#operations-user-updateUser button.try-out__btn"
        },
        userOperationPutExecuteBtn: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(3) div#operations-user-updateUser button.execute"
        },
        userOperationPutParameter: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(3) div#operations-user-updateUser div.parameters-col_description input"
        },
        userOperationPutResponseHeader: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(3) div#operations-user-updateUser div.parameters-col_description input"
        },
        /**
         * Delete /user
         */
        userOperationDeleteContainer: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(3) div#operations-user-deleteUser"
        },
        userOperationDeleteTitle: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(3) div#operations-user-deleteUser .opblock-summary-delete span.opblock-summary-path span"
        },
        userOperationDeleteCollpase: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(3) div#operations-user-deleteUser .opblock-summary-delete"
        },
        userOperationDeleteCollapseContainer: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(3) div#operations-user-deleteUser>div:nth-child(2)"
        },
        userOperationDeleteTryBtn: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(3) div#operations-user-deleteUser button.try-out__btn"
        },
        userOperationDeleteExecuteBtn: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(3) div#operations-user-deleteUser button.execute"
        },
        userOperationDeleteParameter: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(3) div#operations-user-deleteUser div.parameters-col_description input"
        },
        userOperationDeleteResponseHeader: {
          selector: ".swagger-ui .opblock-tag-section:nth-child(3) .opblock-delete div.parameters-col_description input"
        },

      }
    },
    /* Model Container */
    modelWrapper: {
      selector: ".swagger-ui .wrapper:nth-child(4)",
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
