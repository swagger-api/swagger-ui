# Cypress to Playwright migration inventory (temporary)

| Cypress spec | Playwright spec | `it(` | status | notes |
|---|---|---|---|---|
| a11y/authorize-popup.cy.js | a11y/authorize-popup.spec.ts | 2 | todo |  |
| a11y/response-tabs.cy.js | a11y/response-tabs.spec.ts | 3 | todo |  |
| bugs/4442.cy.js | bugs/4442.spec.ts | 2 | todo |  |
| bugs/4641.cy.js | bugs/4641.spec.ts | 3 | todo | intercept, wait, before/after |
| bugs/4838.cy.js | bugs/4838.spec.ts | 1 | todo |  |
| bugs/4865.cy.js | bugs/4865.spec.ts | 2 | todo | window |
| bugs/4867.cy.js | bugs/4867.spec.ts | 1 | todo |  |
| bugs/4943.cy.js | bugs/4943.spec.ts | 2 | todo |  |
| bugs/5043.cy.js | bugs/5043.spec.ts | 2 | todo |  |
| bugs/5060.cy.js | bugs/5060.spec.ts | 1 | todo |  |
| bugs/5070.cy.js | bugs/5070.spec.ts | 1 | todo |  |
| bugs/5072.cy.js | bugs/5072.spec.ts | 2 | todo |  |
| bugs/5129.cy.js | bugs/5129.spec.ts | 8 | todo | wait |
| bugs/5138.cy.js | bugs/5138.spec.ts | 1 | todo | wait |
| bugs/5164.cy.js | bugs/5164.spec.ts | 1 | todo |  |
| bugs/5188.cy.js | bugs/5188.spec.ts | 2 | todo |  |
| bugs/5452.cy.js | bugs/5452.spec.ts | 2 | todo |  |
| bugs/5453.cy.js | bugs/5453.spec.ts | 1 | todo |  |
| bugs/5455.cy.js | bugs/5455.spec.ts | 1 | todo |  |
| bugs/5458.cy.js | bugs/5458.spec.ts | 2 | todo |  |
| bugs/5660.cy.js | bugs/5660.spec.ts | 2 | todo |  |
| bugs/6016.cy.js | bugs/6016.spec.ts | 6 | todo |  |
| bugs/6158.cy.js | bugs/6158.spec.ts | 4 | todo |  |
| bugs/6183.cy.js | bugs/6183.spec.ts | 1 | todo | intercept, wait |
| bugs/6276.cy.js | bugs/6276.spec.ts | 3 | todo |  |
| bugs/6351.cy.js | bugs/6351.spec.ts | 1 | todo | window |
| bugs/6369.cy.js | bugs/6369.spec.ts | 4 | todo |  |
| bugs/6442.cy.js | bugs/6442.spec.ts | 2 | todo |  |
| bugs/6475.cy.js | bugs/6475.spec.ts | 4 | todo |  |
| bugs/6540.cy.js | bugs/6540.spec.ts | 1 | todo |  |
| bugs/6627.cy.js | bugs/6627.spec.ts | 1 | todo |  |
| bugs/7996.cy.js | bugs/7996.spec.ts | 2 | todo |  |
| bugs/8217.cy.js | bugs/8217.spec.ts | 1 | todo | type-special |
| bugs/editor-1868.cy.js | bugs/editor-1868.spec.ts | 1 | todo | window |
| bugs/swos-63.cy.js | bugs/swos-63.spec.ts | 4 | todo |  |
| features/auth-bearer-flow.cy.js | features/auth-bearer-flow.spec.ts | 2 | todo | intercept, wait, focused, before/after |
| features/auth-code-flow-pkce-without-secret.cy.js | features/auth-code-flow-pkce-without-secret.spec.ts | 2 | todo | window |
| features/deep-linking.cy.js | features/deep-linking.spec.ts | 15 | todo | window, factory/helper, 2 it.skip |
| features/default-model-rendering.cy.js | features/default-model-rendering.spec.ts | 1 | todo |  |
| features/dynamic-default-oauth.cy.js | features/dynamic-default-oauth.spec.ts | 4 | todo | window |
| features/external-docs.cy.js | features/external-docs.spec.ts | 8 | todo | factory/helper |
| features/info.cy.js | features/info.spec.ts | 9 | todo |  |
| features/license.cy.js | features/license.spec.ts | 9 | todo |  |
| features/model-collapse.cy.js | features/model-collapse.spec.ts | 3 | todo | factory/helper |
| features/models-virtualization.cy.js | features/models-virtualization.spec.ts | 13 | todo | wait, scrollTo |
| features/multiple-examples-core.cy.js | features/multiple-examples-core.spec.ts | 17 | todo | type-special, factory/helper |
| features/oas-badge.cy.js | features/oas-badge.spec.ts | 4 | todo |  |
| features/oas3-callbacks.cy.js | features/oas3-callbacks.spec.ts | 1 | todo |  |
| features/oas3-extension.cy.js | features/oas3-extension.spec.ts | 3 | todo | before/after |
| features/oas3-multiple-media-type.cy.js | features/oas3-multiple-media-type.spec.ts | 9 | todo | intercept, before/after |
| features/oas3-multiple-servers.cy.js | features/oas3-multiple-servers.spec.ts | 4 | todo |  |
| features/oas3-request-body-allow-empty-values.cy.js | features/oas3-request-body-allow-empty-values.spec.ts | 6 | todo |  |
| features/oas3-request-body-default-views.cy.js | features/oas3-request-body-default-views.spec.ts | 1 | todo |  |
| features/oas3-request-body-required.cy.js | features/oas3-request-body-required.spec.ts | 8 | todo | intercept, before/after |
| features/oas3-user-edit-request-body-flows.cy.js | features/oas3-user-edit-request-body-flows.spec.ts | 4 | todo | type-special |
| features/oas3-xml.cy.js | features/oas3-xml.spec.ts | 8 | todo |  |
| features/oas31-auth-mutual-tls.cy.js | features/oas31-auth-mutual-tls.spec.ts | 3 | todo |  |
| features/oas31-extension.cy.js | features/oas31-extension.spec.ts | 2 | todo | before/after |
| features/oas32-contact-and-license.cy.js | features/oas32-contact-and-license.spec.ts | 2 | todo |  |
| features/oas32-extension.cy.js | features/oas32-extension.spec.ts | 2 | todo | before/after |
| features/oas32-query-operation.cy.js | features/oas32-query-operation.spec.ts | 2 | todo |  |
| features/operations-virtualization.cy.js | features/operations-virtualization.spec.ts | 9 | todo | window, wait, scrollTo, factory/helper |
| features/parameter-array-missing-items.cy.js | features/parameter-array-missing-items.spec.ts | 1 | todo |  |
| features/parameter-order.cy.js | features/parameter-order.spec.ts | 1 | todo |  |
| features/parameter-schema.cy.js | features/parameter-schema.spec.ts | 4 | todo | before/after |
| features/parameters-one-of-any-of.cy.js | features/parameters-one-of-any-of.spec.ts | 2 | todo |  |
| features/response-empty-examples-object.cy.js | features/response-empty-examples-object.spec.ts | 1 | todo |  |
| features/response-extension.cy.js | features/response-extension.spec.ts | 4 | todo |  |
| features/schema-form-enum-boolean.cy.js | features/schema-form-enum-boolean.spec.ts | 8 | todo | before/after |
| features/schema-form.cy.js | features/schema-form.spec.ts | 35 | todo | type-special |
| features/schema-rendering.cy.js | features/schema-rendering.spec.ts | 1 | todo |  |
| features/spec-parse-to-json.cy.js | features/spec-parse-to-json.spec.ts | 1 | todo |  |
| features/syntax-highlighting-json.cy.js | features/syntax-highlighting-json.spec.ts | 4 | todo |  |
| features/try-it-out-enabled.cy.js | features/try-it-out-enabled.spec.ts | 2 | todo |  |
| features/try-it-out-non-200-response-body.cy.js | features/try-it-out-non-200-response-body.spec.ts | 1 | todo | intercept, wait, before/after |
| features/try-it-out-reset.cy.js | features/try-it-out-reset.spec.ts | 1 | todo | type-special |
| features/try-it-out-schema-required-override-allowed.cy.js | features/try-it-out-schema-required-override-allowed.spec.ts | 1 | todo |  |
| features/try-it-out-schema-type-array-with-example.cy.js | features/try-it-out-schema-type-array-with-example.spec.ts | 8 | todo |  |
| features/urls.cy.js | features/urls.spec.ts | 8 | todo | window |
| features/webhooks.cy.js | features/webhooks.spec.ts | 3 | todo |  |
| features/oas32/oas32-component-only.cy.js | features/oas32/oas32-component-only.spec.ts | 1 | todo |  |
| features/oas32/oas32-query-operation.cy.js | features/oas32/oas32-query-operation.spec.ts | 17 | todo |  |
| features/oas32/oas32-version-detection.cy.js | features/oas32/oas32-version-detection.spec.ts | 1 | todo |  |
| features/oauth2-flows/application.cy.js | features/oauth2-flows/application.spec.ts | 3 | todo | intercept, focused, before/after |
| features/oauth2-flows/password.cy.js | features/oauth2-flows/password.spec.ts | 2 | todo | intercept, before/after |
| features/plugins/json-schema-2020-12/empty-schema.cy.js | features/plugins/json-schema-2020-12/empty-schema.spec.ts | 1 | todo |  |
| features/plugins/json-schema-2020-12/examples.cy.js | features/plugins/json-schema-2020-12/examples.spec.ts | 4 | todo | before/after |
| features/plugins/json-schema-2020-12/expansion.cy.js | features/plugins/json-schema-2020-12/expansion.spec.ts | 1 | todo |  |
| features/plugins/json-schema-2020-12/extension-keywords.cy.js | features/plugins/json-schema-2020-12/extension-keywords.spec.ts | 6 | todo | before/after |
| features/plugins/json-schema-2020-12/schema-title.cy.js | features/plugins/json-schema-2020-12/schema-title.spec.ts | 1 | todo |  |
| features/plugins/json-schema-2020-12/unique-items.cy.js | features/plugins/json-schema-2020-12/unique-items.spec.ts | 2 | todo | before/after |
| features/plugins/oas3/all-of-circular-ref.cy.js | features/plugins/oas3/all-of-circular-ref.spec.ts | 1 | todo |  |
| features/plugins/oas3/complex-spec.cy.js | features/plugins/oas3/complex-spec.spec.ts | 1 | todo | scrollTo, factory/helper |
| features/plugins/oas3/one-of-any-of-example.cy.js | features/plugins/oas3/one-of-any-of-example.spec.ts | 1 | todo |  |
| features/plugins/oas3/request-body-complex-schema-properties.cy.js | features/plugins/oas3/request-body-complex-schema-properties.spec.ts | 4 | todo | before/after |
| features/plugins/oas3/request-body-upload-file.cy.js | features/plugins/oas3/request-body-upload-file.spec.ts | 16 | todo | before/after |
| features/plugins/oas31/oas31-parameter-schema.cy.js | features/plugins/oas31/oas31-parameter-schema.spec.ts | 8 | todo | before/after |
| features/plugins/oas31/oas31-request-body-complex-schema-properties.cy.js | features/plugins/oas31/oas31-request-body-complex-schema-properties.spec.ts | 8 | todo | before/after |
| features/plugins/oas31/oas31-request-body-upload-file.cy.js | features/plugins/oas31/oas31-request-body-upload-file.spec.ts | 28 | todo | before/after |
| features/plugins/oas31/oas31-response-empty-content.cy.js | features/plugins/oas31/oas31-response-empty-content.spec.ts | 1 | todo |  |
| features/plugins/oas31/oas31-response-empty-media-type.cy.js | features/plugins/oas31/oas31-response-empty-media-type.spec.ts | 1 | todo |  |
| features/plugins/oas31/oas31-response-no-content.cy.js | features/plugins/oas31/oas31-response-no-content.spec.ts | 1 | todo |  |
| features/plugins/oas31/oas31-schema-expansion.cy.js | features/plugins/oas31/oas31-schema-expansion.spec.ts | 3 | todo |  |
| features/plugins/oas31/oas31-webhook-examples.cy.js | features/plugins/oas31/oas31-webhook-examples.spec.ts | 2 | todo |  |
| features/plugins/oas32/oas32-json-schema-rendering.cy.js | features/plugins/oas32/oas32-json-schema-rendering.spec.ts | 9 | todo | before/after |
| features/plugins/oas32/oas32-request-body-complex-schema-properties.cy.js | features/plugins/oas32/oas32-request-body-complex-schema-properties.spec.ts | 8 | todo | before/after |
| features/plugins/oas32/oas32-schema-expansion.cy.js | features/plugins/oas32/oas32-schema-expansion.spec.ts | 2 | todo |  |
| features/plugins/topbar/linking-to-configured-urls.cy.js | features/plugins/topbar/linking-to-configured-urls.spec.ts | 3 | todo |  |
| security/anonymous.cy.js | security/anonymous.spec.ts | 3 | todo |  |
| security/apikey.cy.js | security/apikey.spec.ts | 1 | todo |  |
| security/oauth2.cy.js | security/oauth2.spec.ts | 1 | todo | stub, window, wait |
| security/sequential-import-chaining.cy.js | security/sequential-import-chaining.spec.ts | 6 | todo | wait |

Total files: 112, total `it(`: 461
