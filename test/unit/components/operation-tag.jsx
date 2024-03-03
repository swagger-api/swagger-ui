import React from "react"
import { shallow } from "enzyme"
import OperationTag from "core/components/operation-tag"
import Im from "immutable"
import { Link } from "core/components/layout-utils"

describe("<OperationTag/>", function(){
  it("render externalDocs URL for swagger v2", function(){

    const dummyComponent = () => null
    const components = {
      Collapse: () => dummyComponent,
      Markdown: () => dummyComponent,
      DeepLink: () => dummyComponent,
      Link
    }

    let props = {
      tagObj: Im.fromJS({
        tagDetails: {
          externalDocs: {
            description: "Find out more",
            url: "http://swagger.io"
          }
        }
      }),
      tag: "testtag",
      getConfigs: () => ({}),
      getComponent: c => components[c],
      layoutSelectors: {
        currentFilter() {
          return null
        },
        isShown() {
          return true
        },
        show() {
          return true
        }
      }
    }

    let wrapper = shallow(<OperationTag {...props}/>)

    const opblockTag = wrapper.find(".opblock-tag")
    expect(opblockTag.length).toEqual(1)
    expect(opblockTag.getElement().type).toEqual("h3")

    const renderedLink = wrapper.find("Link")
    expect(renderedLink.length).toEqual(1)
    expect(renderedLink.props().href).toEqual("http://swagger.io")
  })
})
