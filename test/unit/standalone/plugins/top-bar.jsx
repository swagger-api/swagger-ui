import React from "react"
import { shallow } from "enzyme"
import TopBar from "standalone/plugins/top-bar/components/TopBar"

const Component = () => null
const getComponent = () => Component
const getConfigs = () => ({})

describe("<TopBar />", function () {
  it("provides the banner landmark", function () {
    const layoutActions = { updateFilter: jest.fn() }
    const specActions = { download: jest.fn(), updateUrl: jest.fn() }
    const wrapper = shallow(
      <TopBar
        authActions={{ restoreAuthorization: jest.fn() }}
        getComponent={getComponent}
        getConfigs={getConfigs}
        layoutActions={layoutActions}
        specActions={specActions}
        specSelectors={{ loadingStatus: () => null, url: () => "" }}
      />
    )

    expect(wrapper.type()).toEqual("header")
    expect(wrapper.props().role).toEqual("banner")
  })
})
