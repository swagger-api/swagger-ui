/**
 * @prettier
 *
 * We're currently stuck with using deep-extend as it handles the following case:
 *
 * deepExtend({ a: 1 }, { a: undefined }) => { a: undefined }
 *
 * NOTE1: lodash.merge & lodash.mergeWith prefers to ignore undefined values
 * NOTE2: oauth2RedirectUrl and withCredentials options can be set to undefined. By expecting null instead of undefined, we can't use lodash.merge.
 *
 * TODO(vladimir.gorej@gmail.com): remove deep-extend in favor of lodash.merge
 */
import deepExtend from "deep-extend"

export default deepExtend
