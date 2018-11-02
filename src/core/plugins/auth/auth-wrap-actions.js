var platform = require("platform")

// Get the device ID needed for the SSO redirect URL if running in China
export const configureAuth = (oriAction, system) => (payload) => {
    let hostName = window.location.hostname
    if (!hostName.endsWith("evepc.163.com")) {
      system.authActions.toggleAuthButton(payload)
      oriAction(payload)
    } else {
      let resolution = window.innerWidth + "*" + window.innerHeight
      let deviceType = platform.product !== null ? platform.product : "PC"
      let params = {
        game_id: "aecfu6bgiuaaaal2-g-ma79",
        device_type: deviceType,
        system_name: platform.os.family,
        system_version: platform.os.version,
        resolution: resolution,
        device_model: platform.os.architecture
      }
      let deviceIdUrl= "https://mpay-web.g.mkey.163.com/device/init"
      let deviceIdHeaders = {
        "Origin": window.location.protocol + "//" + hostName,
        "Content-Type": "application/x-www-form-urlencoded"
      }
      let errorMessage = "Authorization failed to initialize, please try and reload this page again."

      system.fn.fetch({
        url: deviceIdUrl,
        method: "get",
        query: params,
        headers: deviceIdHeaders,
      })
      .then(function (response) {
        if ( !response.ok ) {
          system.errActions.newAuthErr( {
            authId: "fetch_device_id",
            level: "error",
            source: "auth",
            message: errorMessage
          })
          return
        }

        let data = JSON.parse(response.data)
        let deviceId = data.device.id
        payload.additionalQueryStringParams["device_id"] = deviceId

        system.authActions.toggleAuthButton(payload)
        oriAction(payload)
        })
        .catch(e => { //eslint-disable-line no-unused-vars
          system.errActions.newAuthErr( {
            authId: "fetch_device_id",
            level: "error",
            source: "auth",
            message: errorMessage
          })
        })
    }
}
