/**
 * @prettier
 */
/* eslint-disable react/jsx-no-bind, react/prop-types */
import React from "react"
import { mount } from "enzyme"

import Models from "core/plugins/oas31/components/models/models"

const fakeComponent =
  (name) =>
  ({ children, ...props }) => {
    return (
      <div data-component-name={name} {...props}>
        {children}
      </div>
    )
  }

describe("<OAS31Models />", function () {
  it("should request resolved subtree when schemas section is open with defaultModelsExpandDepth=1", function () {
    const requestResolvedSubtree = jest.fn()
    const schemas = {
      Pet: {
        type: "object",
        properties: { petType: { type: "string" } },
        discriminator: {
          propertyName: "petType",
          mapping: {
            dog: "#/components/schemas/Dog",
            cat: "#/components/schemas/Cat",
          },
        },
      },
      Dog: {
        allOf: [
          { $ref: "#/components/schemas/Pet" },
          {
            type: "object",
            properties: { breed: { type: "string" } },
          },
        ],
      },
    }

    mount(
      <Models
        specSelectors={{
          selectSchemas: () => schemas,
          specResolvedSubtree: () => null,
        }}
        specActions={{
          requestResolvedSubtree: requestResolvedSubtree,
        }}
        layoutSelectors={{
          isShown: () => true,
        }}
        layoutActions={{
          show: jest.fn(),
          readyToScroll: jest.fn(),
        }}
        getConfigs={() => ({
          docExpansion: "list",
          defaultModelsExpandDepth: 1,
        })}
        getComponent={(name) => fakeComponent(name)}
        fn={{
          jsonSchema202012: {
            useFn: () => ({
              getTitle: () => "",
            }),
          },
        }}
      />
    )

    expect(requestResolvedSubtree).toHaveBeenCalledWith([
      "components",
      "schemas",
    ])
  })

  it("should not request resolved subtree when schemas are already resolved", function () {
    const requestResolvedSubtree = jest.fn()
    const schemas = {
      Pet: { type: "object", properties: { petType: { type: "string" } } },
    }

    mount(
      <Models
        specSelectors={{
          selectSchemas: () => schemas,
          specResolvedSubtree: () => ({}),
        }}
        specActions={{
          requestResolvedSubtree: requestResolvedSubtree,
        }}
        layoutSelectors={{
          isShown: () => true,
        }}
        layoutActions={{
          show: jest.fn(),
          readyToScroll: jest.fn(),
        }}
        getConfigs={() => ({
          docExpansion: "list",
          defaultModelsExpandDepth: 1,
        })}
        getComponent={(name) => fakeComponent(name)}
        fn={{
          jsonSchema202012: {
            useFn: () => ({
              getTitle: () => "",
            }),
          },
        }}
      />
    )

    expect(requestResolvedSubtree).not.toHaveBeenCalled()
  })

  it("should not request resolved subtree when schemas section is closed", function () {
    const requestResolvedSubtree = jest.fn()
    const schemas = {
      Pet: { type: "object", properties: { petType: { type: "string" } } },
    }

    mount(
      <Models
        specSelectors={{
          selectSchemas: () => schemas,
          specResolvedSubtree: () => null,
        }}
        specActions={{
          requestResolvedSubtree: requestResolvedSubtree,
        }}
        layoutSelectors={{
          isShown: () => false,
        }}
        layoutActions={{
          show: jest.fn(),
          readyToScroll: jest.fn(),
        }}
        getConfigs={() => ({
          docExpansion: "none",
          defaultModelsExpandDepth: 1,
        })}
        getComponent={(name) => fakeComponent(name)}
        fn={{
          jsonSchema202012: {
            useFn: () => ({
              getTitle: () => "",
            }),
          },
        }}
      />
    )

    expect(requestResolvedSubtree).not.toHaveBeenCalled()
  })

  it("should request resolved subtree for discriminator+allOf schemas with defaultModelsExpandDepth=1", function () {
    const requestResolvedSubtree = jest.fn()
    const schemas = {
      Pet: {
        type: "object",
        required: ["petType"],
        properties: { petType: { type: "string" } },
        discriminator: {
          propertyName: "petType",
          mapping: {
            dog: "#/components/schemas/Dog",
            cat: "#/components/schemas/Cat",
          },
        },
      },
      Dog: {
        allOf: [
          { $ref: "#/components/schemas/Pet" },
          {
            type: "object",
            properties: {
              breed: { type: "string" },
              barkVolume: {
                type: "integer",
                description: "Volume of the bark",
              },
            },
          },
        ],
      },
      Cat: {
        allOf: [
          { $ref: "#/components/schemas/Pet" },
          {
            type: "object",
            properties: {
              color: { type: "string" },
              purrLoudness: {
                type: "integer",
                description: "Loudness of the purr",
              },
            },
          },
        ],
      },
    }

    mount(
      <Models
        specSelectors={{
          selectSchemas: () => schemas,
          specResolvedSubtree: () => null,
        }}
        specActions={{
          requestResolvedSubtree: requestResolvedSubtree,
        }}
        layoutSelectors={{
          isShown: () => true,
        }}
        layoutActions={{
          show: jest.fn(),
          readyToScroll: jest.fn(),
        }}
        getConfigs={() => ({
          docExpansion: "list",
          defaultModelsExpandDepth: 1,
        })}
        getComponent={(name) => fakeComponent(name)}
        fn={{
          jsonSchema202012: {
            useFn: () => ({
              getTitle: () => "",
            }),
          },
        }}
      />
    )

    expect(requestResolvedSubtree).toHaveBeenCalledWith([
      "components",
      "schemas",
    ])
  })

  it("should render all schema entries from selectSchemas", function () {
    const schemas = {
      Pet: { type: "object" },
      Dog: { type: "object" },
      Cat: { type: "object" },
    }

    const wrapper = mount(
      <Models
        specSelectors={{
          selectSchemas: () => schemas,
          specResolvedSubtree: () => ({}),
        }}
        specActions={{
          requestResolvedSubtree: jest.fn(),
        }}
        layoutSelectors={{
          isShown: () => true,
        }}
        layoutActions={{
          show: jest.fn(),
          readyToScroll: jest.fn(),
        }}
        getConfigs={() => ({
          docExpansion: "list",
          defaultModelsExpandDepth: 1,
        })}
        getComponent={(name) => fakeComponent(name)}
        fn={{
          jsonSchema202012: {
            useFn: () => ({
              getTitle: () => "",
            }),
          },
        }}
      />
    )

    const jsonSchemaComponents = wrapper.find(
      '[data-component-name="JSONSchema202012"]'
    )
    expect(jsonSchemaComponents).toHaveLength(3)
  })
})
