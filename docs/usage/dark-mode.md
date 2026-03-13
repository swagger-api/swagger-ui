# Dark Mode

Swagger UI supports dark mode to provide a better viewing experience in low-light environments. Dark mode can be enabled in several ways depending on your deployment scenario.

## Enabling Dark Mode via Configuration

The easiest way to enable dark mode is through the `theme` configuration option:

```javascript
SwaggerUI({
  dom_id: '#swagger-ui',
  url: 'https://petstore.swagger.io/v2/swagger.json',
  theme: {
    defaultMode: 'dark'
  }
});
```

When `theme.defaultMode` is set to `'dark'`, Swagger UI will load in dark mode by default. This works across all layouts and deployment scenarios.

## Using the Dark Mode Toggle

If you're using the StandaloneLayoutPreset, a dark mode toggle button is available in the top bar. Users can click this button to switch between light and dark modes at any time.

```javascript
SwaggerUI({
  dom_id: '#swagger-ui',
  url: 'https://petstore.swagger.io/v2/swagger.json',
  presets: [SwaggerUI.presets.apis, SwaggerUIStandalonePreset]
});
```

## System Preference Detection

When `theme.defaultMode` is not explicitly set to `'dark'`, Swagger UI will check the browser's system preference (`prefers-color-scheme: dark`) and automatically enable dark mode if the user's system is set to dark mode.

## Embedded Usage

Dark mode works seamlessly in embedded scenarios, including iframes and custom integrations:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" type="text/css" href="./swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  
  <script src="./swagger-ui-bundle.js"></script>
  <script>
    SwaggerUI({
      dom_id: '#swagger-ui',
      url: 'https://petstore.swagger.io/v2/swagger.json',
      theme: {
        defaultMode: 'dark'  // Enable dark mode by default
      }
    });
  </script>
</body>
</html>
```

The dark mode styles are scoped to the `.swagger-ui` container, ensuring they don't interfere with your host application's styles.

## Using with swagger-ui-react

If you're using the React component version, you can enable dark mode via the `theme` prop:

```jsx
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

function MySwaggerUI() {
  return (
    <SwaggerUI
      url="https://petstore.swagger.io/v2/swagger.json"
      theme={{ defaultMode: 'dark' }}
    />
  )
}
```

## Programmatic Control

You can programmatically control dark mode using the dark mode plugin actions:

```javascript
const ui = SwaggerUI({
  dom_id: '#swagger-ui',
  url: 'https://petstore.swagger.io/v2/swagger.json'
});

// Enable dark mode
ui.darkModeActions.setDarkMode(true);

// Toggle dark mode
ui.darkModeActions.toggleDarkMode();

// Check if dark mode is enabled
const isDarkMode = ui.darkModeSelectors.isDarkMode();
```

## Docker Environment Variable

When using the Docker image, you can set the `THEME_DEFAULT_MODE` environment variable:

```bash
docker run -p 80:8080 -e THEME_DEFAULT_MODE="dark" swaggerapi/swagger-ui
```

## CSS Scoping and Customization

All dark mode styles are scoped to the `.swagger-ui` container within the `html.dark-mode` selector. This ensures:

- Dark mode styles only apply to Swagger UI elements
- No CSS leakage into your host application
- Easy customization through CSS overrides

### Custom Dark Mode Colors

You can customize dark mode colors by overriding the CSS variables or targeting specific selectors:

```css
/* Override dark mode background */
html.dark-mode .swagger-ui {
  background: #1a1a1a;
}

/* Override dark mode text color */
html.dark-mode .swagger-ui {
  color: #e0e0e0;
}
```

## Migration from Manual Class Manipulation

If you were previously adding the `dark-mode` class to the `<html>` element manually, you should migrate to using the `theme.defaultMode` configuration:

**Before:**
```javascript
SwaggerUI({
  dom_id: '#swagger-ui',
  url: 'https://petstore.swagger.io/v2/swagger.json'
});
// Manually add dark mode
document.documentElement.classList.add('dark-mode');
```

**After:**
```javascript
SwaggerUI({
  dom_id: '#swagger-ui',
  url: 'https://petstore.swagger.io/v2/swagger.json',
  theme: {
    defaultMode: 'dark'  // Use configuration instead
  }
});
```

The manual approach will continue to work for backwards compatibility, but using the configuration option is recommended as it integrates with the dark mode state management system.
