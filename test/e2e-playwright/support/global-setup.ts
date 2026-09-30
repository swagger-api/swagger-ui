/**
 * @prettier
 */
import { startServer } from "./oauth2-server"

// Starts the OAuth2 test server (port 3231) once for the whole run. The
// returned function is Playwright's globalTeardown.
export default async function globalSetup(): Promise<() => Promise<void>> {
  return startServer()
}
