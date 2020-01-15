/**
 * @prettier
 */

// The standard dev config doesn't allow overriding contentBase via the CLI,
// which we do in the npm scripts for e2e tests. 
//
// This variant avoids contentBase in the config, so the CLI values take hold.

import devConfig from "./dev.babel"

// set the common e2e port 3230
devConfig.devServer.port = 3230

// unset contentBase
delete devConfig.devServer.contentBase

export default devConfig
