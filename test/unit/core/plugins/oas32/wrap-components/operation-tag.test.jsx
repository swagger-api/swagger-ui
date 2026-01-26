/**
 * @prettier
 */
import React from "react"
import { shallow } from "enzyme"
import { fromJS } from "immutable"
import OperationTagWrapper from "core/plugins/oas32/wrap-components/operation-tag"

describe("OAS32 OperationTag wrapper", () => {
  it("should render Original component for non-OAS32 specs", () => {
    const Original = () => <div className="original">Original Tag</div>
    const system = {
      specSelectors: {
        isOAS32: jest.fn(() => false),
      },
      getComponent: jest.fn(),
    }

    const WrappedComponent = OperationTagWrapper(Original, system)
    const wrapper = shallow(<WrappedComponent tag="Users" />)

    // Should render Original component without OAS32 wrapper
    expect(wrapper.type()).toBe(Original)
  })

  it("should render enhanced component for OAS32 specs with tag extensions", () => {
    const Original = () => <div className="original">Original Tag</div>
    const Markdown = ({ source }) => <span>{source}</span>

    const system = {
      specSelectors: {
        isOAS32: jest.fn(() => true),
        selectTagSummaryField: jest.fn((tagName) =>
          tagName === "Users" ? "User management operations" : null
        ),
        selectTagKindField: jest.fn((tagName) =>
          tagName === "Users" ? "resource" : null
        ),
        selectTagParentField: jest.fn(() => null),
      },
      getComponent: jest.fn(() => Markdown),
    }

    const WrappedComponent = OperationTagWrapper(Original, system)
    const wrapper = shallow(<WrappedComponent tag="Users" />)

    expect(wrapper.find(".oas32-tag-wrapper").exists()).toBe(true)
    expect(wrapper.find(".oas32-tag-extensions").exists()).toBe(true)
    expect(wrapper.find(".oas32-tag-summary").exists()).toBe(true)
    expect(wrapper.find(".oas32-tag-kind").exists()).toBe(true)
  })

  it("should display tag summary correctly", () => {
    const Original = () => <div className="original">Original Tag</div>
    const Markdown = ({ source }) => <span>{source}</span>

    const system = {
      specSelectors: {
        isOAS32: jest.fn(() => true),
        selectTagSummaryField: jest.fn((tagName) =>
          tagName === "Webhooks" ? "Webhook operations summary" : null
        ),
        selectTagKindField: jest.fn(() => null),
        selectTagParentField: jest.fn(() => null),
      },
      getComponent: jest.fn(() => Markdown),
    }

    const WrappedComponent = OperationTagWrapper(Original, system)
    const wrapper = shallow(<WrappedComponent tag="Webhooks" />)

    const summary = wrapper.find(".oas32-tag-summary")
    expect(summary.exists()).toBe(true)
    expect(summary.text()).toContain("Summary:")
  })

  it("should display tag kind correctly", () => {
    const Original = () => <div className="original">Original Tag</div>
    const Markdown = ({ source }) => <span>{source}</span>

    const system = {
      specSelectors: {
        isOAS32: jest.fn(() => true),
        selectTagSummaryField: jest.fn(() => null),
        selectTagKindField: jest.fn((tagName) =>
          tagName === "Webhooks" ? "webhook" : null
        ),
        selectTagParentField: jest.fn(() => null),
      },
      getComponent: jest.fn(() => Markdown),
    }

    const WrappedComponent = OperationTagWrapper(Original, system)
    const wrapper = shallow(<WrappedComponent tag="Webhooks" />)

    const kind = wrapper.find(".oas32-tag-kind")
    expect(kind.exists()).toBe(true)
    expect(kind.text()).toContain("Kind:")
    expect(kind.text()).toContain("webhook")
  })

  it("should display tag parent correctly", () => {
    const Original = () => <div className="original">Original Tag</div>
    const Markdown = ({ source }) => <span>{source}</span>

    const system = {
      specSelectors: {
        isOAS32: jest.fn(() => true),
        selectTagSummaryField: jest.fn(() => null),
        selectTagKindField: jest.fn(() => null),
        selectTagParentField: jest.fn((tagName) =>
          tagName === "User Profile" ? "Users" : null
        ),
      },
      getComponent: jest.fn(() => Markdown),
    }

    const WrappedComponent = OperationTagWrapper(Original, system)
    const wrapper = shallow(<WrappedComponent tag="User Profile" />)

    const parent = wrapper.find(".oas32-tag-parent")
    expect(parent.exists()).toBe(true)
    expect(parent.text()).toContain("Parent:")
    expect(parent.text()).toContain("Users")
  })

  it("should not display extensions wrapper when no OAS32 fields present", () => {
    const Original = () => <div className="original">Original Tag</div>
    const Markdown = ({ source }) => <span>{source}</span>

    const system = {
      specSelectors: {
        isOAS32: jest.fn(() => true),
        selectTagSummaryField: jest.fn(() => null),
        selectTagKindField: jest.fn(() => null),
        selectTagParentField: jest.fn(() => null),
      },
      getComponent: jest.fn(() => Markdown),
    }

    const WrappedComponent = OperationTagWrapper(Original, system)
    const wrapper = shallow(<WrappedComponent tag="Standard" />)

    expect(wrapper.find(".oas32-tag-wrapper").exists()).toBe(true)
    expect(wrapper.find(".oas32-tag-extensions").exists()).toBe(false)
  })

  it("should call selectors with correct tag name", () => {
    const Original = () => <div className="original">Original Tag</div>
    const Markdown = ({ source }) => <span>{source}</span>

    const selectTagSummaryField = jest.fn(() => () => "Summary")
    const selectTagKindField = jest.fn(() => () => "webhook")
    const selectTagParentField = jest.fn(() => null)

    const system = {
      specSelectors: {
        isOAS32: jest.fn(() => true),
        selectTagSummaryField,
        selectTagKindField,
        selectTagParentField,
      },
      getComponent: jest.fn(() => Markdown),
    }

    const WrappedComponent = OperationTagWrapper(Original, system)
    shallow(<WrappedComponent tag="CustomTag" />)

    expect(selectTagSummaryField).toHaveBeenCalledWith("CustomTag")
    expect(selectTagKindField).toHaveBeenCalledWith("CustomTag")
    expect(selectTagParentField).toHaveBeenCalledWith("CustomTag")
  })

  it("should handle undefined selectors gracefully", () => {
    const Original = () => <div className="original">Original Tag</div>
    const Markdown = ({ source }) => <span>{source}</span>

    const system = {
      specSelectors: {
        isOAS32: jest.fn(() => true),
        selectTagSummaryField: undefined,
        selectTagKindField: undefined,
        selectTagParentField: undefined,
      },
      getComponent: jest.fn(() => Markdown),
    }

    const WrappedComponent = OperationTagWrapper(Original, system)
    const wrapper = shallow(<WrappedComponent tag="Users" />)

    // Should render without errors
    expect(wrapper.find(".oas32-tag-wrapper").exists()).toBe(true)
    expect(wrapper.find(".oas32-tag-extensions").exists()).toBe(false)
  })
})
