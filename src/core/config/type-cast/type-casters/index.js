/**
 * @prettier
 */

import booleanTypeCaster from "./boolean"
import combinedTypeCaster from "./combined"
import falseTypeCaster from "./false"
import nullTypeCaster from "./null"
import numberTypeCaster from "./number"
import undefinedTypeCaster from "./undefined"

const typeCasters = {
  deepLinking: booleanTypeCaster,
  defaultModelExpandDepth: numberTypeCaster,
  defaultModelsExpandDepth: numberTypeCaster,
  displayOperationId: booleanTypeCaster,
  displayRequestDuration: booleanTypeCaster,
  dom_id: nullTypeCaster,
  domNode: nullTypeCaster,
  filter: combinedTypeCaster(nullTypeCaster, booleanTypeCaster),
  maxDisplayedTags: combinedTypeCaster(nullTypeCaster, numberTypeCaster),
  oauth2RedirectUrl: undefinedTypeCaster,
  persistAuthorization: booleanTypeCaster,
  requestSnippetsEnabled: booleanTypeCaster,
  showCommonExtensions: booleanTypeCaster,
  showExtensions: booleanTypeCaster,
  showMutatedRequest: booleanTypeCaster,
  syntaxHighlight: falseTypeCaster,
  "syntaxHighlight.activated": booleanTypeCaster,
  tryItOutEnabled: booleanTypeCaster,
  urls: nullTypeCaster,
  validatorUrl: nullTypeCaster,
  withCredentials: combinedTypeCaster(undefinedTypeCaster, booleanTypeCaster),
}

export default typeCasters
