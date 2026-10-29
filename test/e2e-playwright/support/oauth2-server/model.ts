/**
 * @prettier
 */
// from https://github.com/pedroetb/node-oauth2-server-example
import type {
  AuthorizationCode,
  Client,
  Token,
  User,
} from "@node-oauth/oauth2-server"

interface ClientConfig extends Client {
  clientSecret: string
}

interface TokenRecord {
  accessToken: string
  [key: string]: unknown
}

interface UserConfig extends User {
  username: string
  password: string
}

const config: {
  clients: ClientConfig[]
  confidentialClients: ClientConfig[]
  tokens: TokenRecord[]
  users: UserConfig[]
} = {
  clients: [
    {
      id: "application",
      clientId: "application",
      clientSecret: "secret",
      grants: ["password", "implicit"],
      redirectUris: [],
    },
  ],
  confidentialClients: [
    {
      id: "confidentialApplication",
      clientId: "confidentialApplication",
      clientSecret: "topSecret",
      grants: ["client_credentials"],
      redirectUris: [],
    },
  ],
  tokens: [],
  users: [
    {
      id: "123",
      username: "swagger",
      password: "password",
    },
  ],
}

/*
 * Methods used by all grant types.
 */

const getAccessToken = (bearerToken: string) => {
  const tokens = config.tokens.filter(
    (token) => token.accessToken === bearerToken
  )

  return tokens[0] || false
}

const getClient = (clientId: string, clientSecret?: string) => {
  const clients = [...config.clients, ...config.confidentialClients].filter(
    (client) =>
      client.clientId === clientId &&
      (!clientSecret || client.clientSecret === clientSecret)
  )

  return clients[0] || false
}

const saveToken = (
  token: Token | AuthorizationCode,
  client: Client,
  user: User
) => {
  const savedToken = Object.assign({}, token, { client, user })
  config.tokens.push(savedToken as unknown as TokenRecord)
  return savedToken
}

/*
 * Method used only by password grant type.
 */

const getUser = (username: string, password: string) => {
  const users = config.users.filter(
    (user) => user.username === username && user.password === password
  )

  return users[0] || false
}

/*
 * Method used only by client_credentials grant type.
 */

const getUserFromClient = (client: Client) => {
  const clients = config.confidentialClients.filter(
    (c) => c.clientId === client.clientId
  )

  if (clients.length) {
    return { id: client.clientId, username: client.clientId }
  }

  return false
}

/**
 * Export model definition object.
 */

export default {
  getAccessToken,
  getClient,
  saveToken,
  getUser,
  getUserFromClient,
}
