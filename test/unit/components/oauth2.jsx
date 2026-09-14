/**
 * @prettier
 */
import React from "react"
import { mount } from "enzyme"
import Im from "immutable"
import Oauth2 from "core/components/auth/oauth2"

describe("<Oauth2/>", function () {
  const dummyComponent = () => null
  const components = {
    Input: dummyComponent,
    Row: dummyComponent,
    Col: dummyComponent,
    Button: dummyComponent,
    authError: dummyComponent,
    JumpToPath: dummyComponent,
    Markdown: dummyComponent,
    InitializedInput: dummyComponent,
  }

  const makeProps = ({ flow, oauth2RedirectUrl, isOAS3 = false }) => ({
    name: "petstore_auth",
    authorized: Im.Map(),
    getComponent: (c) => components[c],
    schema: Im.Map({
      flow,
      authorizationUrl: "https://example.com/authorize",
      tokenUrl: "https://example.com/token",
    }),
    authSelectors: {
      getConfigs: () => ({}),
      selectAuthPath: () => "",
      authorized: () => Im.Map(),
    },
    authActions: {},
    errSelectors: {
      allErrors: () => Im.List(),
    },
    oas3Selectors: {},
    specSelectors: {
      isOAS3: () => isOAS3,
    },
    errActions: {},
    getConfigs: () => ({ oauth2RedirectUrl }),
  })

  it("displays the OAuth2 Redirect URL for the implicit flow when configured", function () {
    const wrapper = mount(
      <Oauth2
        {...makeProps({
          flow: "implicit",
          oauth2RedirectUrl: "https://example.com/oauth2-redirect.html",
        })}
      />
    )

    expect(wrapper.text()).toContain(
      "OAuth2 Redirect URL: https://example.com/oauth2-redirect.html"
    )

    wrapper.unmount()
  })

  it("displays the OAuth2 Redirect URL for the accessCode flow when configured", function () {
    const wrapper = mount(
      <Oauth2
        {...makeProps({
          flow: "accessCode",
          oauth2RedirectUrl: "https://example.com/oauth2-redirect.html",
        })}
      />
    )

    expect(wrapper.text()).toContain(
      "OAuth2 Redirect URL: https://example.com/oauth2-redirect.html"
    )

    wrapper.unmount()
  })

  it("does not display the OAuth2 Redirect URL when it is not configured", function () {
    const wrapper = mount(
      <Oauth2
        {...makeProps({ flow: "implicit", oauth2RedirectUrl: undefined })}
      />
    )

    expect(wrapper.text()).not.toContain("OAuth2 Redirect URL")

    wrapper.unmount()
  })

  it("does not display the OAuth2 Redirect URL for flows that don't use a redirect", function () {
    const wrapper = mount(
      <Oauth2
        {...makeProps({
          flow: "application",
          oauth2RedirectUrl: "https://example.com/oauth2-redirect.html",
        })}
      />
    )

    expect(wrapper.text()).not.toContain("OAuth2 Redirect URL")

    wrapper.unmount()
  })
})
