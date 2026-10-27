import React from "react"
import { shallow } from "enzyme"
import { fromJS } from "immutable"
import ScopeDisplay from "core/components/auth/scope-display"

describe("<ScopeDisplay/>", function() {
  const mockAuthSelectors = {
    definitionsToAuthorize: jest.fn(() => fromJS([]))
  }

  const mockSpecSelectors = {
    securityDefinitions: jest.fn(() => fromJS({}))
  }

  describe("OAuth2 scopes", function() {
    it("should display OAuth2 scopes correctly", function() {
      const security = fromJS([
        {
          "OAuth2": ["read:api", "write:api"]
        }
      ])

      const wrapper = shallow(
        <ScopeDisplay
          security={security}
          authSelectors={mockAuthSelectors}
          specSelectors={mockSpecSelectors}
        />
      )

      expect(wrapper.find(".opblock-security-display").length).toEqual(1)
      expect(wrapper.find(".opblock-security-scheme-name").text()).toEqual("OAuth2")
      expect(wrapper.find(".opblock-security-scope").length).toEqual(2)
      expect(wrapper.find(".opblock-security-scope").at(0).text()).toEqual("read:api")
      expect(wrapper.find(".opblock-security-scope").at(1).text()).toEqual("write:api")
    })

    it("should display OAuth2 with empty scopes", function() {
      const security = fromJS([
        {
          "OAuth2": []
        }
      ])

      const wrapper = shallow(
        <ScopeDisplay
          security={security}
          authSelectors={mockAuthSelectors}
          specSelectors={mockSpecSelectors}
        />
      )

      expect(wrapper.find(".opblock-security-display").length).toEqual(1)
      expect(wrapper.find(".opblock-security-scheme-name").text()).toEqual("OAuth2")
      expect(wrapper.find(".opblock-security-scope").length).toEqual(0)
    })
  })

  describe("Multiple security schemes", function() {
    it("should display OR logic between security requirements", function() {
      const security = fromJS([
        {
          "OAuth2": ["read:api"]
        },
        {
          "ApiKey": []
        }
      ])

      const wrapper = shallow(
        <ScopeDisplay
          security={security}
          authSelectors={mockAuthSelectors}
          specSelectors={mockSpecSelectors}
        />
      )

      expect(wrapper.find(".opblock-security-requirement-group").length).toEqual(2)
      expect(wrapper.find(".opblock-security-operator").text()).toContain("OR")
    })

    it("should display AND logic within a security requirement", function() {
      const security = fromJS([
        {
          "OAuth2": ["read:api"],
          "ApiKey": []
        }
      ])

      const wrapper = shallow(
        <ScopeDisplay
          security={security}
          authSelectors={mockAuthSelectors}
          specSelectors={mockSpecSelectors}
        />
      )

      expect(wrapper.find(".opblock-security-requirement-group").length).toEqual(1)
      expect(wrapper.find(".opblock-security-requirement").length).toEqual(2)
      expect(wrapper.find(".opblock-security-operator").at(0).text()).toContain("+")
    })
  })

  describe("Other security schemes", function() {
    it("should display API Key authentication", function() {
      const security = fromJS([
        {
          "ApiKeyAuth": []
        }
      ])

      const wrapper = shallow(
        <ScopeDisplay
          security={security}
          authSelectors={mockAuthSelectors}
          specSelectors={mockSpecSelectors}
        />
      )

      expect(wrapper.find(".opblock-security-scheme-name").text()).toEqual("ApiKeyAuth")
      expect(wrapper.find(".opblock-security-scope").length).toEqual(0)
    })

    it("should display Bearer authentication", function() {
      const security = fromJS([
        {
          "BearerAuth": []
        }
      ])

      const wrapper = shallow(
        <ScopeDisplay
          security={security}
          authSelectors={mockAuthSelectors}
          specSelectors={mockSpecSelectors}
        />
      )

      expect(wrapper.find(".opblock-security-scheme-name").text()).toEqual("BearerAuth")
    })

    it("should display Basic authentication", function() {
      const security = fromJS([
        {
          "BasicAuth": []
        }
      ])

      const wrapper = shallow(
        <ScopeDisplay
          security={security}
          authSelectors={mockAuthSelectors}
          specSelectors={mockSpecSelectors}
        />
      )

      expect(wrapper.find(".opblock-security-scheme-name").text()).toEqual("BasicAuth")
    })

    it("should display OpenID Connect with scopes", function() {
      const security = fromJS([
        {
          "OpenIDConnect": ["openid", "profile", "email"]
        }
      ])

      const wrapper = shallow(
        <ScopeDisplay
          security={security}
          authSelectors={mockAuthSelectors}
          specSelectors={mockSpecSelectors}
        />
      )

      expect(wrapper.find(".opblock-security-scheme-name").text()).toEqual("OpenIDConnect")
      expect(wrapper.find(".opblock-security-scope").length).toEqual(3)
      expect(wrapper.find(".opblock-security-scope").at(0).text()).toEqual("openid")
      expect(wrapper.find(".opblock-security-scope").at(1).text()).toEqual("profile")
      expect(wrapper.find(".opblock-security-scope").at(2).text()).toEqual("email")
    })
  })

  describe("Optional security", function() {
    it("should display optional security correctly", function() {
      const security = fromJS([
        {}
      ])

      const wrapper = shallow(
        <ScopeDisplay
          security={security}
          authSelectors={mockAuthSelectors}
          specSelectors={mockSpecSelectors}
        />
      )

      expect(wrapper.find(".opblock-security-optional").length).toEqual(1)
      expect(wrapper.find(".opblock-security-optional").text()).toEqual("Optional")
    })
  })

  describe("Edge cases", function() {
    it("should return null for no security", function() {
      const wrapper = shallow(
        <ScopeDisplay
          security={null}
          authSelectors={mockAuthSelectors}
          specSelectors={mockSpecSelectors}
        />
      )

      expect(wrapper.isEmptyRender()).toBe(true)
    })

    it("should return null for empty security list", function() {
      const security = fromJS([])

      const wrapper = shallow(
        <ScopeDisplay
          security={security}
          authSelectors={mockAuthSelectors}
          specSelectors={mockSpecSelectors}
        />
      )

      expect(wrapper.isEmptyRender()).toBe(true)
    })

    it("should handle complex multi-scheme requirements", function() {
      const security = fromJS([
        {
          "OAuth2": ["read:api", "write:api"],
          "ApiKey": []
        },
        {
          "BasicAuth": []
        },
        {
          "BearerAuth": [],
          "CustomAuth": ["admin"]
        }
      ])

      const wrapper = shallow(
        <ScopeDisplay
          security={security}
          authSelectors={mockAuthSelectors}
          specSelectors={mockSpecSelectors}
        />
      )

      expect(wrapper.find(".opblock-security-requirement-group").length).toEqual(3)

      // First group: OAuth2 + ApiKey
      const firstGroup = wrapper.find(".opblock-security-requirement-group").at(0)
      expect(firstGroup.find(".opblock-security-requirement").length).toEqual(2)

      // Second group: BasicAuth
      const secondGroup = wrapper.find(".opblock-security-requirement-group").at(1)
      expect(secondGroup.find(".opblock-security-requirement").length).toEqual(1)

      // Third group: BearerAuth + CustomAuth
      const thirdGroup = wrapper.find(".opblock-security-requirement-group").at(2)
      expect(thirdGroup.find(".opblock-security-requirement").length).toEqual(2)
    })
  })
})