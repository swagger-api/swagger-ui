/**
 * @prettier
 */
const encodeQuotedPrintable = (content) => {
  let quotedPrintable = ""

  for (let i = 0; i < content.length; i++) {
    const charCode = content.charCodeAt(i)

    if (charCode === 61) {
      // ASCII content of "="
      quotedPrintable += "=3D"
    } else if (
      (charCode >= 33 && charCode <= 60) ||
      (charCode >= 62 && charCode <= 126) ||
      charCode === 9 ||
      charCode === 32
    ) {
      quotedPrintable += content.charAt(i)
    } else if (charCode === 13 || charCode === 10) {
      quotedPrintable += "\r\n"
    } else if (charCode > 126) {
      // convert non-ASCII characters to UTF-8 and encode each byte
      const utf8 = unescape(encodeURIComponent(content.charAt(i)))
      for (let j = 0; j < utf8.length; j++) {
        quotedPrintable +=
          "=" + ("0" + utf8.charCodeAt(j).toString(16)).slice(-2).toUpperCase()
      }
    } else {
      quotedPrintable +=
        "=" + ("0" + charCode.toString(16)).slice(-2).toUpperCase()
    }
  }

  return quotedPrintable
}

export default encodeQuotedPrintable
