/**
 * @prettier
 */
import Registry from "./Registry"
import encode7bit from "../encoders/7bit"
import encode8bit from "../encoders/8bit"
import encodeBinary from "../encoders/binary"
import encodeQuotedPrintable from "../encoders/quoted-printable"
import encodeBase16 from "../encoders/base16"
import encodeBase32 from "../encoders/base32"
import encodeBase64 from "../encoders/base64"

class EncoderRegistry extends Registry {
  #defaults = {
    "7bit": encode7bit,
    "8bit": encode8bit,
    binary: encodeBinary,
    "quoted-printable": encodeQuotedPrintable,
    base16: encodeBase16,
    base32: encodeBase32,
    base64: encodeBase64,
  }

  data = { ...this.#defaults }

  get defaults() {
    return { ...this.#defaults }
  }
}

export default EncoderRegistry
