import { requestSnippetGenerator_curl_bash, requestSnippetGenerator_curl_cmd, requestSnippetGenerator_curl_powershell } from "./fn"
import * as selectors from "./selectors"
import RequestSnippets from "./request-snippets"

export default () => {
  return {
    components: {
      RequestSnippets
    },
    fn: {
      requestSnippetGenerator_curl_bash,
      requestSnippetGenerator_curl_cmd,
      requestSnippetGenerator_curl_powershell,
    },
    statePlugins: {
      requestSnippets: {
        selectors
      }
    }
  }
}
