# Swagger UI - Van Oord

Fork of Swagger UI app to display OpenAPI / Swagger API spec files as React website with a Van Oord theme.

# Add API spec

You can add the API spec of your own app to the drop-down menu in two steps:

1. Add a link to the JSON config file: [deployment/configfiles/config.json](deployment/configfiles/config.json)
2. Deploy new configuration to Kubernetes using Helm:

> helm upgragde metis deployment/
