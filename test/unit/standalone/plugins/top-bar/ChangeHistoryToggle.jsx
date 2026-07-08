import React from "react"
import { shallow } from "enzyme"

import ChangeHistoryToggle from "standalone/plugins/top-bar/components/ChangeHistoryToggle"

jest.mock("standalone/plugins/top-bar/assets/history-icon.svg", () => () => (
  <div>HistoryIcon</div>
))

describe("ChangeHistoryToggle", () => {
  const makeProps = (overrides = {}) => ({
    getConfigs: () => ({ changeHistory: true }),
    specSelectors: {
      loadingStatus: () => "success",
    },
    changeHistorySelectors: {
      hasUnseenChanges: () => false,
    },
    changeHistoryActions: {
      togglePanel: jest.fn(),
    },
    ...overrides,
  })

  it("renders the history icon button", () => {
    const wrapper = shallow(<ChangeHistoryToggle {...makeProps()} />)
    expect(wrapper.find(".change-history-toggle button").length).toEqual(1)
    expect(wrapper.find("button").prop("aria-label")).toEqual(
      "API change history"
    )
  })

  it("calls togglePanel when clicked", () => {
    const changeHistoryActions = { togglePanel: jest.fn() }
    const wrapper = shallow(
      <ChangeHistoryToggle {...makeProps({ changeHistoryActions })} />
    )

    wrapper.find(".change-history-toggle button").simulate("click")
    expect(changeHistoryActions.togglePanel).toHaveBeenCalled()
  })

  it("shows a badge when there are unseen changes", () => {
    const wrapper = shallow(
      <ChangeHistoryToggle
        {...makeProps({
          changeHistorySelectors: { hasUnseenChanges: () => true },
        })}
      />
    )
    expect(wrapper.find(".change-history-badge").length).toEqual(1)
  })

  it("does not render while the spec is loading", () => {
    const wrapper = shallow(
      <ChangeHistoryToggle
        {...makeProps({
          specSelectors: { loadingStatus: () => "loading" },
        })}
      />
    )
    expect(wrapper.isEmptyRender()).toEqual(true)
  })

  it("hides itself when changeHistory config is disabled", () => {
    const wrapper = shallow(
      <ChangeHistoryToggle
        {...makeProps({
          getConfigs: () => ({ changeHistory: false }),
        })}
      />
    )
    expect(wrapper.isEmptyRender()).toEqual(true)
  })
})
