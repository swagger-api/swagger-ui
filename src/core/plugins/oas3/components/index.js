import Callbacks from "./callbacks"
import RequestBody from "./request-body"
import OperationLink from "./operation-link"
import Servers from "./servers"
import ServersContainer from "./servers-container"
import RequestBodyEditor from "./request-body-editor"
import HttpAuth from "./auth/http-auth"
import OperationServers from "./operation-servers"

export default {
  Callbacks,
  HttpAuth,
  RequestBody,
  Servers,
  ServersContainer,
  RequestBodyEditor,
  OperationServers,
  operationLink: OperationLink,
}
