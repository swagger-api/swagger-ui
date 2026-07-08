import React from "react"
import { fromJS } from "immutable"
import { shallow } from "enzyme"

import ChangeHistorySidebar from "core/plugins/change-history/components/ChangeHistorySidebar"

describe("<ChangeHistorySidebar />", () => {
  const Button = ({ children, ...props }) => <button {...props}>{children}</button>

  const makeProps = (history) => ({
    history,
    onClose: jest.fn(),
    onClear: jest.fn(),
    getComponent: (name) => (name === "Button" ? Button : () => null),
  })

  const entries = [
    {
      id: "2",
      timestamp: 1710000000000,
      version: "2.0.0",
      title: "Petstore",
      isBaseline: false,
      changes: [
        { type: "endpoint-added", method: "POST", path: "/pets" },
        { type: "info-changed", field: "version" },
      ],
    },
    {
      id: "1",
      timestamp: 1700000000000,
      version: "1.0.0",
      title: "Petstore",
      isBaseline: true,
      changes: [],
    },
  ]

  it("renders entries from an Immutable history without throwing", () => {
    const wrapper = shallow(<ChangeHistorySidebar {...makeProps(fromJS(entries))} />)
    expect(wrapper.find(".change-history-entry").length).toEqual(2)
    expect(wrapper.find(".change-history-item").length).toEqual(2)
    expect(wrapper.find(".change-history-baseline").length).toEqual(1)
  })

  it("renders entries from a plain-JS history without throwing", () => {
    const wrapper = shallow(<ChangeHistorySidebar {...makeProps(entries)} />)
    expect(wrapper.find(".change-history-entry").length).toEqual(2)
  })

  it("renders an empty state when there is no history", () => {
    const wrapper = shallow(<ChangeHistorySidebar {...makeProps(fromJS([]))} />)
    expect(wrapper.find(".change-history-empty").length).toEqual(1)
  })
})
