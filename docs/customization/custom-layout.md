# Creating a custom layout

**Layouts** are a special type of component that Swagger UI uses as the root component for the entire application. You can define custom layouts in order to have high-level control over what ends up on the page.

By default, Swagger UI uses `BaseLayout`, which is built into the application. You can specify a different layout to be used by passing the layout's name as the `layout` parameter to Swagger UI. Be sure to provide your custom layout as a component to Swagger UI.

<br>

For example, if you wanted to create a custom layout that only displayed operations, you could define an `OperationsLayout`:

```js
import React from "react"

// Create the layout component
class OperationsLayout extends React.Component {
  render() {
    const {
      getComponent
    } = this.props

    const Operations = getComponent("operations", true)

    return (
      <div>
        <Operations />
      </div>
    )
  }
}

// Create the plugin that provides our layout component
const OperationsLayoutPlugin = () => {
  return {
    components: {
      OperationsLayout: OperationsLayout
    }
  }
}

// Provide the plugin to Swagger-UI, and select OperationsLayout
// as the layout for Swagger-UI
SwaggerUI({
  url: "https://petstore.swagger.io/v2/swagger.json",
  plugins: [ OperationsLayoutPlugin ],
  layout: "OperationsLayout"
})
```

### Augmenting the default layout

If you'd like to build around the `BaseLayout` instead of replacing it, you can pull the `BaseLayout` into your custom layout and use it:

```js
import React from "react"

// Create the layout component
class AugmentingLayout extends React.Component {
  render() {
    const {
      getComponent
    } = this.props

    const BaseLayout = getComponent("BaseLayout", true)

    return (
      <div>
        <div className="myCustomHeader">
          <h1>I have a custom header above Swagger-UI!</h1>
        </div>
        <BaseLayout />
      </div>
    )
  }
}

// Create the plugin that provides our layout component
const AugmentingLayoutPlugin = () => {
  return {
    components: {
      AugmentingLayout: AugmentingLayout
    }
  }
}

// Provide the plugin to Swagger-UI, and select AugmentingLayout
// as the layout for Swagger-UI
SwaggerUI({
  url: "https://petstore.swagger.io/v2/swagger.json",
  plugins: [ AugmentingLayoutPlugin ],
  layout: "AugmentingLayout"
})
```
