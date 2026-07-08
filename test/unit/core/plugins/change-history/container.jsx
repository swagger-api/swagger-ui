import React from "react"
import { shallow } from "enzyme"

import ChangeHistoryContainer from "core/containers/change-history"

describe("<ChangeHistoryContainer />", () => {
  const Button = ({ children, ...props }) => <button {...props}>{children}</button>

  const makeProps = (overrides = {}) => ({
    getComponent: (name) => (name === "Button" ? Button : () => null),
    getConfigs: () => ({ changeHistory: true }),
    specSelectors: {
      loadingStatus: () => "success",
    },
    changeHistorySelectors: {
      isPanelOpen: () => false,
      hasUnseenChanges: () => false,
      hasHistory: () => true,
      history: () => [],
    },
    changeHistoryActions: {
      togglePanel: jest.fn(),
      setPanelOpen: jest.fn(),
      clearHistory: jest.fn(),
    },
    ...overrides,
  })

  it("does not render while the panel is closed", () => {
    const wrapper = shallow(<ChangeHistoryContainer {...makeProps()} />)
    expect(wrapper.isEmptyRender()).toEqual(true)
  })

  it("renders the sidebar and backdrop when the panel is open", () => {
    const props = makeProps({
      changeHistorySelectors: {
        isPanelOpen: () => true,
        hasUnseenChanges: () => false,
        hasHistory: () => true,
        history: () => [],
      },
    })
    const wrapper = shallow(<ChangeHistoryContainer {...props} />)
    expect(wrapper.find(".change-history-backdrop").length).toEqual(1)
    expect(wrapper.find("ChangeHistorySidebar").length).toEqual(1)
  })

  it("does not render while the spec is loading", () => {
    const props = makeProps({
      specSelectors: { loadingStatus: () => "loading" },
      changeHistorySelectors: {
        isPanelOpen: () => true,
        hasUnseenChanges: () => false,
        hasHistory: () => true,
        history: () => [],
      },
    })
    const wrapper = shallow(<ChangeHistoryContainer {...props} />)
    expect(wrapper.isEmptyRender()).toEqual(true)
  })

  it("hides itself when changeHistory config is disabled", () => {
    const props = makeProps({
      getConfigs: () => ({ changeHistory: false }),
      changeHistorySelectors: {
        isPanelOpen: () => true,
        hasUnseenChanges: () => false,
        hasHistory: () => true,
        history: () => [],
      },
    })
    const wrapper = shallow(<ChangeHistoryContainer {...props} />)
    expect(wrapper.isEmptyRender()).toEqual(true)
  })
})
