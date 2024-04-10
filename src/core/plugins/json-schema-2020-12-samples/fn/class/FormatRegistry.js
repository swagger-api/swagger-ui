/**
 * @prettier
 */
import Registry from "./Registry"
import int32Generator from "../generators/int32"
import int64Generator from "../generators/int64"
import floatGenerator from "../generators/float"
import doubleGenerator from "../generators/double"
import emailGenerator from "../generators/email"
import idnEmailGenerator from "../generators/idn-email"
import hostnameGenerator from "../generators/hostname"
import idnHostnameGenerator from "../generators/idn-hostname"
import ipv4Generator from "../generators/ipv4"
import ipv6Generator from "../generators/ipv6"
import uriGenerator from "../generators/uri"
import uriReferenceGenerator from "../generators/uri-reference"
import iriGenerator from "../generators/iri"
import iriReferenceGenerator from "../generators/iri-reference"
import uuidGenerator from "../generators/uuid"
import uriTemplateGenerator from "../generators/uri-template"
import jsonPointerGenerator from "../generators/json-pointer"
import relativeJsonPointerGenerator from "../generators/relative-json-pointer"
import dateTimeGenerator from "../generators/date-time"
import dateGenerator from "../generators/date"
import timeGenerator from "../generators/time"
import durationGenerator from "../generators/duration"
import passwordGenerator from "../generators/password"
import regexGenerator from "../generators/regex"

class FormatRegistry extends Registry {
  #defaults = {
    int32: int32Generator,
    int64: int64Generator,
    float: floatGenerator,
    double: doubleGenerator,
    email: emailGenerator,
    "idn-email": idnEmailGenerator,
    hostname: hostnameGenerator,
    "idn-hostname": idnHostnameGenerator,
    ipv4: ipv4Generator,
    ipv6: ipv6Generator,
    uri: uriGenerator,
    "uri-reference": uriReferenceGenerator,
    iri: iriGenerator,
    "iri-reference": iriReferenceGenerator,
    uuid: uuidGenerator,
    "uri-template": uriTemplateGenerator,
    "json-pointer": jsonPointerGenerator,
    "relative-json-pointer": relativeJsonPointerGenerator,
    "date-time": dateTimeGenerator,
    date: dateGenerator,
    time: timeGenerator,
    duration: durationGenerator,
    password: passwordGenerator,
    regex: regexGenerator,
  }

  data = { ...this.#defaults }

  get defaults() {
    return { ...this.#defaults }
  }
}

export default FormatRegistry
