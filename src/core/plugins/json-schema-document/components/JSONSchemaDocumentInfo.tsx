/**
 * @prettier
 */
import React from "react"
import { Map } from "immutable"

import {
  SUPPORTED_DIALECTS,
  getBaseURI,
  getDocumentTitle,
  getRetrievalURI,
} from "../fn"

type Component = React.ComponentType<Record<string, unknown>>

export interface JSONSchemaDocumentInfoProps {
  specSelectors: {
    specJson: () => Map<string, unknown>
    jsonSchemaDialect: () => string | null
    url: () => string | undefined
  }
  getComponent: (name: string, container?: boolean) => unknown
}

/**
 * The header of a standalone JSON Schema document, in place of the OpenAPI
 * `info`: the name of the document as the page heading, next to stamps naming
 * the dialect and the kind of document, the URIs the document is known by and
 * its `description`, as plain text.
 */
const JSONSchemaDocumentInfo = ({
  specSelectors,
  getComponent,
}: JSONSchemaDocumentInfoProps) => {
  const InfoUrl = getComponent("InfoUrl") as Component
  const specJson = specSelectors.specJson()
  const dialect = specSelectors.jsonSchemaDialect()
  const dialectName =
    SUPPORTED_DIALECTS.find(({ identifier }) => identifier === dialect)?.name ??
    ""
  const dialectVersion = dialectName.replace(/^JSON Schema /, "")
  const url = specSelectors.url()
  // a document that wasn't retrieved (a `spec` object or string) is known by
  // the page's URI only as the default base URI "an implementation may use"
  // (core, 9.1.1), so there's no retrieval URI to show
  const defaultURI = getRetrievalURI(
    url,
    globalThis.document?.baseURI ?? globalThis.location?.href
  )
  const retrievalURI = typeof url === "string" && url !== "" ? defaultURI : null
  const baseURI = getBaseURI(specJson, defaultURI)

  const description = specJson.get("description")

  return (
    <div className="info json-schema-document__info">
      <hgroup className="main">
        <h1 className="title">
          {getDocumentTitle(specJson, dialectName)}
          <span>
            {dialectVersion && (
              <small>
                <pre className="version">{dialectVersion}</pre>
              </small>
            )}
            <small className="version-stamp">
              <pre className="version">JSON Schema</pre>
            </small>
          </span>
        </h1>
        {(retrievalURI !== null || baseURI !== null) && (
          <table className="json-schema-document__uris">
            <tbody>
              {retrievalURI !== null && (
                <tr>
                  <td>Retrieval URI</td>
                  <td>
                    <InfoUrl getComponent={getComponent} url={retrievalURI} />
                  </td>
                </tr>
              )}
              {baseURI !== null && baseURI !== retrievalURI && (
                <tr>
                  <td>Base URI</td>
                  <td>
                    <InfoUrl getComponent={getComponent} url={baseURI} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </hgroup>

      {typeof description === "string" && description !== "" && (
        <div className="info__description description">
          {/* plain text: JSON Schema gives `description` no Markdown meaning,
              and the renderer shows the keyword as text as well */}
          <p>{description}</p>
        </div>
      )}
    </div>
  )
}

export default JSONSchemaDocumentInfo
