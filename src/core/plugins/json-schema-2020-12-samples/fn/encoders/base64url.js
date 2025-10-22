/**
 * @prettier
 */
import encodeBase64 from './base64'

const encodeBase64Url = (content) =>{
return encodeBase64(content)
    .replace(/=/g, "")   // Remove padding
    .replace(/\+/g, "-") // Replace + with -
    .replace(/\//g, "_") // Replace / with _
} 

export default encodeBase64Url
