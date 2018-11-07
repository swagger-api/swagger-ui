/* eslint-env mocha */
import React from "react"
import expect from "expect"
import { render } from "enzyme"
import { fromJS } from "immutable"
import Info from "components/info"
import Markdown from "components/providers/markdown"

describe("<Info/> Sanitization", function(){
	const dummyComponent = () => null
	const components = {
		Markdown
	}
	const props = {
		getComponent: c => components[c] || dummyComponent,
		info: fromJS({
			title: "Test Title **strong** <script>alert(1)</script>",
			description: "Description *with* <script>Markdown</script>"
		}),
		host: "example.test",
		basePath: "/api"
	}

	it("renders sanitized .title content", function(){
		let wrapper = render(<Info {...props}/>)
		expect(wrapper.find(".title").html()).toEqual("Test Title **strong** &lt;script&gt;alert(1)&lt;/script&gt;")
	})

	it("renders sanitized .description content", function() {
		let wrapper = render(<Info {...props}/>)
		expect(wrapper.find(".description").html()).toEqual("<div class=\"markdown\"><p>Description <em>with</em> </p>\n</div>")
	})
})
