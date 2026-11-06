/**
 * @prettier
 */
import React from "react"

import { sanitizeUrl } from "core/utils/url"

import { schema } from "../../../prop-types"
import { useComponent } from "../../../hooks"
import { toPlainObject, toSchemaObject } from "../../../fn"
import { PROPERTY } from "../../../styles"
import OASObject, { OASField } from "./OASObject"
import type { KeywordProps, OASExternalDocs } from "../../../types"

/**
 * OpenAPI `externalDocs`: the markdown `description` and the `url` as
 * children. The link's href always goes through `sanitizeUrl`
 * (`javascript:`, `data:` and `vbscript:` become `about:blank`). It is a
 * plain `<a>` with the attributes of the system `Link` (`rel`, `target`),
 * without Link's unstyled `link` class.
 */
const ExternalDocs = ({ schema }: KeywordProps) => {
  const externalDocs = toPlainObject<OASExternalDocs>(
    toSchemaObject(schema).externalDocs
  )
  const KeywordOASDescription = useComponent("KeywordOASDescription")
  const url = typeof externalDocs.url === "string" ? externalDocs.url : ""

  return (
    <OASObject
      keyword="externalDocs"
      label="External documentation"
      value={externalDocs}
      hasFields={Boolean(externalDocs.description || externalDocs.url)}
    >
      {externalDocs.description && (
        <li className={PROPERTY}>
          <KeywordOASDescription schema={externalDocs} />
        </li>
      )}
      {url && (
        <li className={PROPERTY}>
          <OASField
            name="url"
            value={
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={sanitizeUrl(url)}
              >
                {url}
              </a>
            }
          />
        </li>
      )}
    </OASObject>
  )
}

ExternalDocs.propTypes = {
  schema: schema.isRequired,
}

export default ExternalDocs
