// from https://github.com/pedroetb/node-oauth2-server-example

let config = {
  clients: [{
    id: "application",
    clientId: "application",
    clientSecret: "secret",
    grants: ["password", "implicit"],
    redirectUris: []
  }],
  confidentialClients: [{
    id: "confidentialApplication",
    clientId: "confidentialApplication",
    clientSecret: "topSecret",
    grants: ["client_credentials"],
    redirectUris: []
  }],
  tokens: [],
  users: [{
    id: "123",
    username: "swagger",
    password: "password"
  }]
}

/*
 * Methods used by all grant types.
 */

let getAccessToken = function (bearerToken) {
  let tokens = config.tokens.filter(function (token) {
    return token.accessToken === bearerToken
  })

  return tokens[0] || false
}

let getClient = function (clientId, clientSecret) {
  let clients = [...config.clients, ...config.confidentialClients].filter(function (client) {
    return client.clientId === clientId && (!clientSecret || client.clientSecret === clientSecret)
  })

  return clients[0] || false
}

let saveToken = function (token, client, user) {
  let savedToken = Object.assign({}, token, { client: client, user: user })
  config.tokens.push(savedToken)
  return savedToken
}

/*
 * Method used only by password grant type.
 */

let getUser = function (username, password) {
  let users = config.users.filter(function (user) {
    return user.username === username && user.password === password
  })

  return users[0] || false
}

/*
 * Method used only by client_credentials grant type.
 */

let getUserFromClient = function (client) {
  let clients = config.confidentialClients.filter(function (c) {
    return c.clientId === client.clientId
  })

  if (clients.length) {
    return { id: client.clientId, username: client.clientId }
  }

  return false
}

/**
 * Export model definition object.
 */

module.exports = {
  getAccessToken: getAccessToken,
  getClient: getClient,
  saveToken: saveToken,
  getUser: getUser,
  getUserFromClient: getUserFromClient
}
