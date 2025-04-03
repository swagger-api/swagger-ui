// import SwaggerUI from 'swagger-ui'
// import 'swagger-ui/dist/swagger-ui.css';

// const spec = require('./swagger-config.yaml');

// const ui = SwaggerUI({
//   spec,
//   dom_id: '#swagger',
// });

// ui.initOAuth({
//   appName: "Swagger UI Webpack Demo",
//   // See https://demo.identityserver.io/ for configuration details.
//   clientId: 'implicit'
// });

import SwaggerUI from 'swagger-ui';
import 'swagger-ui/dist/swagger-ui.css';
import spec from './swagger-config.yaml'; // Correct import for YAML files
import open from 'open';


open('http://localhost:3002');

function isValidUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch (e) {
    return false;
  }
}

const ui = SwaggerUI({
  spec,
  dom_id: '#swagger',
  deepLinking: true,  // ✅ Allows navigation via URL hash
  persistAuthorization: true,  // ✅ Keeps authorization token when navigating
  requestInterceptor: (request) => {
    request.url = sanitizeURL(request.url);
    if (!isValidUrl(request.url)) {
      console.warn('Blocked unsafe request:', request.url);
      request.url = 'about:blank';
    }
    request.headers['Accept'] = 'application/json';
    return request;
  }
});


ui.initOAuth({
  appName: "Swagger UI Webpack Demo",
  clientId: 'implicit'
});

