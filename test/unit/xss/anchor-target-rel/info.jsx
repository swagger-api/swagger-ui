import React from "react"
import { render } from "enzyme"
import { fromJS } from "immutable"
import Info, { InfoUrl } from "components/info"
import { Link } from "components/layout-utils"
import Markdown from "components/providers/markdown"

describe("<Info/> Anchor Target Safety", function(){
	const dummyComponent = () => null
	const components = {
		Markdown,
		InfoUrl,
		Link
	}
	const baseProps = {
		getComponent: c => components[c] || dummyComponent,
		host: "example.test",
		basePath: "/api",
		info: fromJS({
			title: "Hello World"
		})
	}

	it("renders externalDocs links with safe `rel` attributes", function () {
		const props = {
			...baseProps,
			externalDocs: fromJS({
				url: "http://google.com/"
			})
		}
		let wrapper = render(<Info {...props} />)
		const anchor = wrapper.find("a")

		expect(anchor.html()).toEqual("http://google.com/")
		expect(anchor.attr("target")).toEqual("_blank")
		expect(anchor.attr("rel") || "").toMatch("noopener")
		expect(anchor.attr("rel") || "").toMatch("noreferrer")
	})

	it("renders Contact links with safe `rel` attributes", function () {
		const props = {
			...baseProps,
			info: fromJS({
				contact: {
					url: "http://google.com/",
					name: "My Site"
				}
			})
		}
		let wrapper = render(<Info {...props} />)
		const anchor = wrapper.find("a")

		expect(anchor.attr("href")).toEqual("http://google.com/")
		expect(anchor.attr("target")).toEqual("_blank")
		expect(anchor.attr("rel") || "").toMatch("noopener")
		expect(anchor.attr("rel") || "").toMatch("noreferrer")
	})

	it("renders License links with safe `rel` attributes", function () {
		const props = {
			...baseProps,
			info: fromJS({
				license: {
					url: "http://mit.edu/"
				}
			})
		}
		let wrapper = render(<Info {...props} />)
		const anchor = wrapper.find("a")

		expect(anchor.attr("href")).toEqual("http://mit.edu/")
		expect(anchor.attr("target")).toEqual("_blank")
		expect(anchor.attr("rel") || "").toMatch("noopener")
		expect(anchor.attr("rel") || "").toMatch("noreferrer")
	})

	it("renders termsOfService links with safe `rel` attributes", function () {
		const props = {
			...baseProps,
			info: fromJS({
				termsOfService: "http://smartbear.com/"
			})
		}
		let wrapper = render(<Info {...props} />)
		const anchor = wrapper.find("a")

		expect(anchor.attr("href")).toEqual("http://smartbear.com/")
		expect(anchor.attr("target")).toEqual("_blank")
		expect(anchor.attr("rel") || "").toMatch("noopener")
		expect(anchor.attr("rel") || "").toMatch("noreferrer")
	})

	it("renders definition URL links with safe `rel` attributes", function () {
		const props = {
			...baseProps,
			url: "http://petstore.swagger.io/v2/petstore.json"
		}
		let wrapper = render(<Info {...props} />)
		const anchor = wrapper.find("a")

		expect(anchor.attr("href")).toEqual("http://petstore.swagger.io/v2/petstore.json")
		expect(anchor.attr("target")).toEqual("_blank")
		expect(anchor.attr("rel") || "").toMatch("noopener")
		expect(anchor.attr("rel") || "").toMatch("noreferrer")
	})
})
