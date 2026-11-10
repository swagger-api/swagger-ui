/**
 * @prettier
 */
import { startServer } from "./oauth2-server"

// Starts the OAuth2 test server (port 3231) once for the whole run. The
// returned function is Playwright's globalTeardown.
export default async function globalSetup(): Promise<() => Promise<void>> {
  try {
    return await startServer()
  } catch (error) {
    // Locally, tolerate a server left over from another run (mirrors
    // `reuseExistingServer` for the web servers). Never on CI.
    if (
      !process.env.CI &&
      (error as NodeJS.ErrnoException).code === "EADDRINUSE"
    ) {
      return async () => {}
    }
    throw error
  }
}
