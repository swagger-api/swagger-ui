{
  "swagger": "2.0",
  "info": {
    "description": "This is a sample server Petstore server.  You can find out more about Swagger at <a href=\"http://swagger.io\">http://swagger.io</a> or on irc.freenode.net, #swagger.  For this sample, you can use the api key \"special-key\" to test the authorization filters",
    "version": "1.0.0",
    "title": "Swagger Petstore",
    "termsOfService": "http://swagger.io/terms/",
    "contact": {
      "url": "http://swagger.io",
      "name": "Your pals at Swagger",
      "email": "apiteam@swagger.io"
    },
    "license": {
      "name": "Apache 2.0",
      "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
    }
  },
  "host": "petstore.swagger.io",
  "basePath": "/v2",
  "schemes": [
    "http"
  ],
  "tags": [
    {
      "name": "user",
      "description": "Operations about user"
    },
    {
      "name": "store",
      "description": "Access to Petstore orders",
      "externalDocs": {
        "description": "Find out more",
        "url": "http://swagger.io"
      }
    },
    {
      "name": "pet",
      "description": "Everything about your Pets",
      "externalDocs": {
        "description": "Find out more",
        "url": "http://swagger.io"
      }
    }
  ],
  "paths": {
    "/pet": {
      "post": {
        "tags": [
          "pet"
        ],
        "summary": "Add a new pet to the store",
        "description": "",
        "operationId": "addPet",
        "consumes": [
          "application/json",
          "application/xml"
        ],
        "produces": [
          "application/json",
          "application/xml"
        ],
        "parameters": [
          {
            "in": "body",
            "name": "pet",
            "description": "Pet object that needs to be added to the store",
            "required": false,
            "schema": {
              "$ref": "#/definitions/Pet"
            }
          }
        ],
        "responses": {
          "405": {
            "description": "Invalid input"
          }
        },
        "security": [
          {
            "petstore_auth": [
              "write:pets",
              "read:pets"
            ]
          }
        ]
      },
      "put": {
        "tags": [
          "pet"
        ],
        "summary": "Update an existing pet",
        "description": "",
        "operationId": "updatePet",
        "consumes": [
          "application/json",
          "application/xml"
        ],
        "produces": [
          "application/json",
          "application/xml"
        ],
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "description": "Pet object that needs to be added to the store",
            "required": false,
            "schema": {
              "$ref": "#/definitions/Pet"
            }
          }
        ],
        "responses": {
          "405": {
            "description": "Validation exception"
          },
          "404": {
            "description": "Pet not found"
          },
          "400": {
            "description": "Invalid ID supplied"
          }
        },
        "security": [
          {
            "petstore_auth": [
              "write:pets",
              "read:pets"
            ]
          }
        ]
      }
    },
    "/pet/findByStatus": {
      "get": {
        "tags": [
          "pet"
        ],
        "summary": "Finds Pets by status",
        "description": "Multiple status values can be provided with comma seperated strings",
        "operationId": "findPetsByStatus",
        "produces": [
          "application/json",
          "application/xml"
        ],
        "parameters": [
          {
            "in": "query",
            "name": "status",
            "description": "Status values that need to be considered for filter",
            "required": false,
            "type": "array",
            "items": {
              "type": "string"
            },
            "collectionFormat": "multi"
          }
        ],
        "responses": {
          "200": {
            "description": "successful operation",
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/Pet"
              }
            }
          },
          "400": {
            "description": "Invalid status value"
          }
        },
        "security": [
          {
            "petstore_auth": [
              "write:pets",
              "read:pets"
            ]
          }
        ]
      }
    },
    "/pet/findByTags": {
      "get": {
        "tags": [
          "pet"
        ],
        "summary": "Finds Pets by tags",
        "description": "Muliple tags can be provided with comma seperated strings. Use tag1, tag2, tag3 for testing.",
        "operationId": "findPetsByTags",
        "produces": [
          "application/json",
          "application/xml"
        ],
        "parameters": [
          {
            "in": "query",
            "name": "tags",
            "description": "Tags to filter by",
            "required": false,
            "type": "array",
            "items": {
              "type": "string"
            },
            "collectionFormat": "multi"
          }
        ],
        "responses": {
          "200": {
            "description": "successful operation",
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/Pet"
              }
            }
          },
          "400": {
            "description": "Invalid tag value"
          }
        },
        "security": [
          {
            "petstore_auth": [
              "write:pets",
              "read:pets"
            ]
          }
        ]
      }
    },
    "/pet/{petId}": {
      "get": {
        "tags": [
          "pet"
        ],
        "summary": "Find pet by ID",
        "description": "Returns a pet when ID < 10.  ID > 10 or nonintegers will simulate API error conditions",
        "operationId": "getPetById",
        "produces": [
          "application/json",
          "application/xml"
        ],
        "parameters": [
          {
            "in": "path",
            "name": "petId",
            "description": "ID of pet that needs to be fetched",
            "required": true,
            "type": "integer",
            "format": "int64"
          }
        ],
        "responses": {
          "404": {
            "description": "Pet not found"
          },
          "200": {
            "description": "successful operation",
            "schema": {
              "$ref": "#/definitions/Pet"
            }
          },
          "400": {
            "description": "Invalid ID supplied"
          }
        },
        "security": [
          {
            "api_key": []
          },
          {
            "petstore_auth": [
              "write:pets",
              "read:pets"
            ]
          }
        ]
      },
      "post": {
        "tags": [
          "pet"
        ],
        "summary": "Updates a pet in the store with form data",
        "description": "",
        "operationId": "updatePetWithForm",
        "consumes": [
          "application/x-www-form-urlencoded"
        ],
        "produces": [
          "application/json",
          "application/xml"
        ],
        "parameters": [
          {
            "in": "path",
            "name": "petId",
            "description": "ID of pet that needs to be updated",
            "required": true,
            "type": "string"
          },
          {
            "in": "formData",
            "name": "name",
            "description": "Updated name of the pet",
            "required": true,
            "type": "string"
          },
          {
            "in": "formData",
            "name": "status",
            "description": "Updated status of the pet",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "405": {
            "description": "Invalid input"
          }
        },
        "security": [
          {
            "petstore_auth": [
              "write:pets",
              "read:pets"
            ]
          }
        ]
      },
      "delete": {
        "tags": [
          "pet"
        ],
        "summary": "Deletes a pet",
        "description": "",
        "operationId": "deletePet",
        "produces": [
          "application/json",
          "application/xml"
        ],
        "parameters": [
          {
            "in": "header",
            "name": "api_key",
            "description": "",
            "required": true,
            "type": "string"
          },
          {
            "in": "path",
            "name": "petId",
            "description": "Pet id to delete",
            "required": true,
            "type": "integer",
            "format": "int64"
          }
        ],
        "responses": {
          "400": {
            "description": "Invalid pet value"
          }
        },
        "security": [
          {
            "petstore_auth": [
              "write:pets",
              "read:pets"
            ]
          }
        ]
      }
    },
    "/store/order": {
      "post": {
        "tags": [
          "store"
        ],
        "summary": "Place an order for a pet",
        "description": "",
        "operationId": "placeOrder",
        "produces": [
          "application/json",
          "application/xml"
        ],
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "description": "order placed for purchasing the pet",
            "required": false,
            "schema": {
              "$ref": "#/definitions/Order"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "successful operation",
            "schema": {
              "$ref": "#/definitions/Order"
            }
          },
          "400": {
            "description": "Invalid Order"
          }
        }
      }
    },
    "/store/order/{orderId}": {
      "get": {
        "tags": [
          "store"
        ],
        "summary": "Find purchase order by ID",
        "description": "For valid response try integer IDs with value <= 5 or > 10. Other values will generated exceptions",
        "operationId": "getOrderById",
        "produces": [
          "application/json",
          "application/xml"
        ],
        "parameters": [
          {
            "in": "path",
            "name": "orderId",
            "description": "ID of pet that needs to be fetched",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "404": {
            "description": "Order not found"
          },
          "200": {
            "description": "successful operation",
            "schema": {
              "$ref": "#/definitions/Order"
            }
          },
          "400": {
            "description": "Invalid ID supplied"
          }
        }
      },
      "delete": {
        "tags": [
          "store"
        ],
        "summary": "Delete purchase order by ID",
        "description": "For valid response try integer IDs with value < 1000. Anything above 1000 or nonintegers will generate API errors",
        "operationId": "deleteOrder",
        "produces": [
          "application/json",
          "application/xml"
        ],
        "parameters": [
          {
            "in": "path",
            "name": "orderId",
            "description": "ID of the order that needs to be deleted",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "404": {
            "description": "Order not found"
          },
          "400": {
            "description": "Invalid ID supplied"
          }
        }
      }
    },
    "/user": {
      "post": {
        "tags": [
          "user"
        ],
        "summary": "Create user",
        "description": "This can only be done by the logged in user.",
        "operationId": "createUser",
        "produces": [
          "application/json",
          "application/xml"
        ],
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "description": "Created user object",
            "required": false,
            "schema": {
              "$ref": "#/definitions/User"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "successful operation"
          }
        }
      }
    },
    "/user/createWithArray": {
      "post": {
        "tags": [
          "user"
        ],
        "summary": "Creates list of users with given input array",
        "description": "",
        "operationId": "createUsersWithArrayInput",
        "produces": [
          "application/json",
          "application/xml"
        ],
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "description": "List of user object",
            "required": false,
            "schema": {
              "type": "array",
              "items": {
                "$ref": "User"
              }
            }
          }
        ],
        "responses": {
          "default": {
            "description": "successful operation"
          }
        }
      }
    },
    "/user/createWithList": {
      "post": {
        "tags": [
          "user"
        ],
        "summary": "Creates list of users with given input array",
        "description": "",
        "operationId": "createUsersWithListInput",
        "produces": [
          "application/json",
          "application/xml"
        ],
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "description": "List of user object",
            "required": false,
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/User"
              }
            }
          }
        ],
        "responses": {
          "default": {
            "description": "successful operation"
          }
        }
      }
    },
    "/user/login": {
      "get": {
        "tags": [
          "user"
        ],
        "summary": "Logs user into the system",
        "description": "",
        "operationId": "loginUser",
        "produces": [
          "application/json",
          "application/xml"
        ],
        "parameters": [
          {
            "in": "query",
            "name": "username",
            "description": "The user name for login",
            "required": false,
            "type": "string"
          },
          {
            "in": "query",
            "name": "password",
            "description": "The password for login in clear text",
            "required": false,
            "type": "string",
            "format": "password"
          }
        ],
        "responses": {
          "200": {
            "description": "successful operation",
            "schema": {
              "type": "string"
            }
          },
          "400": {
            "description": "Invalid username/password supplied"
          }
        }
      }
    },
    "/user/logout": {
      "get": {
        "tags": [
          "user"
        ],
        "summary": "Logs out current logged in user session",
        "description": "",
        "operationId": "logoutUser",
        "produces": [
          "application/json",
          "application/xml"
        ],
        "responses": {
          "default": {
            "description": "successful operation"
          }
        }
      }
    },
    "/user/{username}": {
      "get": {
        "tags": [
          "user"
        ],
        "summary": "Get user by user name",
        "description": "",
        "operationId": "getUserByName",
        "produces": [
          "application/json",
          "application/xml"
        ],
        "parameters": [
          {
            "in": "path",
            "name": "username",
            "description": "The name that needs to be fetched. Use user1 for testing. ",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "404": {
            "description": "User not found"
          },
          "200": {
            "description": "successful operation",
            "schema": {
              "$ref": "#/definitions/User"
            }
          },
          "400": {
            "description": "Invalid username supplied"
          }
        }
      },
      "put": {
        "tags": [
          "user"
        ],
        "summary": "Updated user",
        "description": "This can only be done by the logged in user.",
        "operationId": "updateUser",
        "produces": [
          "application/json",
          "application/xml"
        ],
        "parameters": [
          {
            "in": "path",
            "name": "username",
            "description": "name that need to be deleted",
            "required": true,
            "type": "string"
          },
          {
            "in": "body",
            "name": "body",
            "description": "Updated user object",
            "required": false,
            "schema": {
              "$ref": "#/definitions/User"
            }
          }
        ],
        "responses": {
          "404": {
            "description": "User not found"
          },
          "400": {
            "description": "Invalid user supplied"
          }
        }
      },
      "delete": {
        "tags": [
          "user"
        ],
        "summary": "Delete user",
        "description": "This can only be done by the logged in user.",
        "operationId": "deleteUser",
        "produces": [
          "application/json",
          "application/xml"
        ],
        "parameters": [
          {
            "in": "path",
            "name": "username",
            "description": "The name that needs to be deleted",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "404": {
            "description": "User not found"
          },
          "400": {
            "description": "Invalid username supplied"
          }
        }
      }
    }
  },
  "securityDefinitions": {
    "api_key": {
      "type": "apiKey",
      "name": "api_key",
      "in": "header"
    },
    "petstore_auth": {
      "type": "oauth2",
      "authorizationUrl": "http://petstore.swagger.io/api/oauth/dialog",
      "flow": "implicit"
    }
  },
  "definitions": {
    "User": {
      "properties": {
        "id": {
          "type": "integer",
          "format": "int64",
          "xml": {
            "name": "id"
          }
        },
        "username": {
          "type": "string",
          "xml": {
            "name": "username"
          }
        },
        "firstName": {
          "type": "string",
          "xml": {
            "name": "firstName"
          }
        },
        "lastName": {
          "type": "string",
          "xml": {
            "name": "lastName"
          }
        },
        "email": {
          "type": "string",
          "xml": {
            "name": "email"
          }
        },
        "password": {
          "type": "string",
          "xml": {
            "name": "password"
          }
        },
        "phone": {
          "type": "string",
          "xml": {
            "name": "phone"
          }
        },
        "userStatus": {
          "type": "integer",
          "format": "int32",
          "xml": {
            "name": "userStatus"
          },
          "description": "User Status"
        }
      },
      "xml": {
        "name": "User"
      }
    },
    "Category": {
      "properties": {
        "id": {
          "type": "integer",
          "format": "int64",
          "xml": {
            "name": "id"
          }
        },
        "name": {
          "type": "string",
          "xml": {
            "name": "name"
          }
        }
      },
      "xml": {
        "name": "Category"
      }
    },
    "Pet": {
      "required": [
        "name",
        "photoUrls"
      ],
      "properties": {
        "id": {
          "type": "integer",
          "format": "int64",
          "xml": {
            "name": "id"
          }
        },
        "category": {
          "xml": {
            "name": "category"
          },
          "$ref": "#/definitions/Category"
        },
        "name": {
          "type": "string",
          "example": "doggie",
          "xml": {
            "name": "name"
          }
        },
        "photoUrls": {
          "type": "array",
          "xml": {
            "name": "photoUrl",
            "wrapped": true
          },
          "items": {
            "type": "string"
          }
        },
        "tags": {
          "type": "array",
          "xml": {
            "name": "tag",
            "wrapped": true
          },
          "items": {
            "$ref": "#/definitions/Tag"
          }
        },
        "status": {
          "type": "string",
          "xml": {
            "name": "status"
          },
          "description": "pet status in the store"
        }
      },
      "xml": {
        "name": "Pet"
      }
    },
    "Tag": {
      "properties": {
        "id": {
          "type": "integer",
          "format": "int64",
          "xml": {
            "name": "id"
          }
        },
        "name": {
          "type": "string",
          "xml": {
            "name": "name"
          }
        }
      },
      "xml": {
        "name": "Tag"
      }
    },
    "Order": {
      "properties": {
        "id": {
          "type": "integer",
          "format": "int64",
          "xml": {
            "name": "id"
          }
        },
        "petId": {
          "type": "integer",
          "format": "int64",
          "xml": {
            "name": "petId"
          }
        },
        "quantity": {
          "type": "integer",
          "format": "int32",
          "xml": {
            "name": "quantity"
          }
        },
        "shipDate": {
          "type": "string",
          "format": "date-time",
          "xml": {
            "name": "shipDate"
          }
        },
        "status": {
          "type": "string",
          "xml": {
            "name": "status"
          },
          "description": "Order Status"
        },
        "complete": {
          "type": "boolean"
        }
      },
      "xml": {
        "name": "Order"
      }
    }
  }
}