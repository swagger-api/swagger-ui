/**
 * @prettier
 */
const encodeBase32 = (content) => {
  const utf8Value = Buffer.from(content).toString("utf8")
  const base32Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  let paddingCount = 0
  let base32Str = ""
  let buffer = 0
  let bufferLength = 0

  for (let i = 0; i < utf8Value.length; i++) {
    buffer = (buffer << 8) | utf8Value.charCodeAt(i)
    bufferLength += 8

    while (bufferLength >= 5) {
      base32Str += base32Alphabet.charAt((buffer >>> (bufferLength - 5)) & 31)
      bufferLength -= 5
    }
  }

  if (bufferLength > 0) {
    base32Str += base32Alphabet.charAt((buffer << (5 - bufferLength)) & 31)
    paddingCount = (8 - ((utf8Value.length * 8) % 5)) % 5
  }

  for (let i = 0; i < paddingCount; i++) {
    base32Str += "="
  }

  return base32Str
}

export default encodeBase32
