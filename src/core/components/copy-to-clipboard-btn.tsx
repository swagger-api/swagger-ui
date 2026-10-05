/**
 * @prettier
 */
import React from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"

const COPY_PATH_LABEL = "Copy path to clipboard"

interface Props {
  textToCopy: string
}

const CopyToClipboardBtn = ({ textToCopy }: Props) => (
  <div
    className="view-line-link copy-to-clipboard"
    title={COPY_PATH_LABEL}
    aria-label={COPY_PATH_LABEL}
  >
    <CopyToClipboard text={textToCopy}>
      <button
        aria-label={COPY_PATH_LABEL}
        title={COPY_PATH_LABEL}
        type="button"
      />
    </CopyToClipboard>
  </div>
)

export default CopyToClipboardBtn
