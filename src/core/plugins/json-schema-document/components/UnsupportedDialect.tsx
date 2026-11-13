/**
 * @prettier
 */
import React from "react"

import { SUPPORTED_DIALECTS } from "../fn"

interface UnsupportedDialectProps {
  $schema: string
  alsoShow?: React.ReactNode
}

/**
 * Shown in place of a JSON Schema document whose root `$schema` names a
 * dialect that isn't supported: it isn't rendered as another dialect.
 */
const UnsupportedDialect = ({ $schema, alsoShow }: UnsupportedDialectProps) => (
  <div className="version-pragma">
    {alsoShow}
    <div className="version-pragma__message version-pragma__message--unsupported-dialect">
      <div>
        <h3>Unable to render this definition</h3>
        <p>
          The root <code>$schema</code> keyword names a JSON Schema dialect that
          is not supported: <code>{$schema}</code>.
        </p>
        <p>
          Supported <code>$schema</code> values:
        </p>
        <ul className="version-pragma__dialects">
          {SUPPORTED_DIALECTS.map(({ identifier, name }) => (
            <li key={identifier}>
              <code>{identifier}</code> ({name})
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
)

export default UnsupportedDialect
