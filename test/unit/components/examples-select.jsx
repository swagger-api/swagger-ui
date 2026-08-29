/* eslint-disable camelcase */
/**
 * @prettier
 */
import React from "react"
import { OrderedMap, fromJS } from "immutable"
import { mount } from "enzyme"

import ExamplesSelect from "core/components/examples-select"

describe("<ExamplesSelect/>", () => {
  // Regression coverage for https://github.com/swagger-api/swagger-ui/issues/5460
  // When the user switches media type, `examples` changes from under the
  // component. If the previously-selected example key is not part of the new
  // `examples`, the component must auto-snap to the first example of the new
  // set and notify its parent via a synthetic `onSelect`.
  describe("auto-snap when examples change and currentExampleKey is stale", () => {
    it("fires a synthetic onSelect with the first new example key", () => {
      const jsonExamples = fromJS({
        foo_json: { value: { foo: "bar" } },
        bar_json: { value: { bar: "foo" } },
      })
      const xmlExamples = fromJS({
        foo_xml: { value: "<foo>bar</foo>" },
        bar_xml: { value: "<bar>foo</bar>" },
      })
      const onSelect = jest.fn()

      const wrapper = mount(
        <ExamplesSelect
          examples={jsonExamples}
          currentExampleKey="bar_json"
          onSelect={onSelect}
        />
      )

      // ignore the synthetic onSelect fired from componentDidMount
      onSelect.mockClear()

      wrapper.setProps({ examples: xmlExamples })

      expect(onSelect).toHaveBeenCalledTimes(1)
      expect(onSelect).toHaveBeenCalledWith("foo_xml", {
        isSyntheticChange: true,
      })
    })

    it("does not snap when the previous key exists in the new examples", () => {
      const examplesA = fromJS({
        shared: { value: "A-shared" },
        only_a: { value: "A-only" },
      })
      const examplesB = fromJS({
        shared: { value: "B-shared" },
        only_b: { value: "B-only" },
      })
      const onSelect = jest.fn()

      const wrapper = mount(
        <ExamplesSelect
          examples={examplesA}
          currentExampleKey="shared"
          onSelect={onSelect}
        />
      )

      onSelect.mockClear()
      wrapper.setProps({ examples: examplesB })

      expect(onSelect).not.toHaveBeenCalled()
    })

    it("fires no auto-snap when the underlying examples reference does not change", () => {
      const examples = fromJS({
        a: { value: "A" },
        b: { value: "B" },
      })
      const onSelect = jest.fn()

      const wrapper = mount(
        <ExamplesSelect
          examples={examples}
          currentExampleKey="a"
          onSelect={onSelect}
        />
      )

      onSelect.mockClear()
      // identical reference; should not trigger the auto-snap branch
      wrapper.setProps({ examples })

      expect(onSelect).not.toHaveBeenCalled()
    })
  })

  describe("componentDidMount", () => {
    it("fires a synthetic onSelect with the first example key on mount", () => {
      const examples = fromJS({
        first_key: { value: "first" },
        second_key: { value: "second" },
      })
      const onSelect = jest.fn()

      mount(
        <ExamplesSelect
          examples={examples}
          currentExampleKey="first_key"
          onSelect={onSelect}
        />
      )

      expect(onSelect).toHaveBeenCalledWith("first_key", {
        isSyntheticChange: true,
      })
    })

    it("does not throw when examples is empty", () => {
      const onSelect = jest.fn()

      expect(() => {
        mount(
          <ExamplesSelect
            examples={new OrderedMap()}
            currentExampleKey={null}
            onSelect={onSelect}
          />
        )
      }).not.toThrow()
    })
  })
})
