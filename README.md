# Swagger UI - Van Oord

Fork of Swagger UI app to display OpenAPI / Swagger API spec files as React website with a Van Oord theme.

# Add API spec

You can add the API spec of your own app to the drop-down menu in two steps:

1. Add a link to the JSON config file: [deployment/configfiles/config_urls.json](./deployment/configfiles/config_urls.json)
2. Deploy new configuration to Kubernetes using Helm:

   ```bash
   >> helm upgragde metis deployment/
   ```
