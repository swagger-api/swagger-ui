/* eslint-env mocha */
import React from "react"
import expect from "expect"
import { shallow } from "enzyme"
import { fromJS } from "immutable"
import PrimitiveModel from "components/primitive-model"

describe("<PrimitiveModel/>", function() {
    describe("Model name", function() {
        const dummyComponent = () => null
        const components = {
            Markdown: dummyComponent,
            EnumModel: dummyComponent
        }
        const props = {
            getComponent: c => components[c],
            name: "Name from props",
            depth: 1,
            schema: fromJS({
                type: "string",
                title: "Custom model title"
            })
        }

        it("renders the schema's title", function() {
            // When
            const wrapper = shallow(<PrimitiveModel {...props}/>)
            const modelTitleEl = wrapper.find("span.model-title")
            expect(modelTitleEl.length).toEqual(1)

            // Then
            expect( modelTitleEl.text() ).toEqual( "Custom model title" )
        })

        it("falls back to the passed-in `name` prop for the title", function() {
            // When
            props.schema = fromJS({
                type: "string"
            })
            const wrapper = shallow(<PrimitiveModel {...props}/>)
            const modelTitleEl = wrapper.find("span.model-title")
            expect(modelTitleEl.length).toEqual(1)

            // Then
            expect( modelTitleEl.text() ).toEqual( "Name from props" )
        })

    })
} )