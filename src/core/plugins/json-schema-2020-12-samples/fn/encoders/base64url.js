/**
 * @prettier
 */
const encodeBase64Url = (content) => Buffer.from(content).toString("base64url")

export default encodeBase64Url
