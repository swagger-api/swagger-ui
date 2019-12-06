import expect from "expect"
import { saveAuthorization, deleteAuthorization } from "../../../../../src/helpers/storage-authorization"

const KEY_PREFIX = "swagger-"

describe("auth plugin - saveAuthorization", () => {
    it("should have no effect by default", () => {
        const system = {
            getConfigs: () => ({})
        }
        let configs = system.getConfigs()
        let apikey = "api_key"
        let value = "password"

        saveAuthorization(configs, apikey, value)

        let keyStorage = `${KEY_PREFIX}${apikey}`
        let storage = localStorage.getItem(keyStorage)

        expect(storage).toBe(null)
    })

    it("should allow setting flag to true via config", () => {
        const system = {
            getConfigs: () => ({
                saveAuthorization: true
            })
        }
        let configs = system.getConfigs()
        let apikey = "api_key"
        let value = "password"

        saveAuthorization(configs, apikey, value)

        let keyStorage = `${KEY_PREFIX}${apikey}`
        let storage = localStorage.getItem(keyStorage)

        expect(storage).toBe(value)

        deleteAuthorization(configs, apikey)

        let newStorage = window.localStorage.getItem(keyStorage)

        expect(newStorage).toBe(null)
    })

    it("should allow setting flag to false via config", () => {
        const system = {
            getConfigs: () => ({
                saveAuthorization: false
            })
        }
        let configs = system.getConfigs()
        let apikey = "api_key"
        let value = "password"

        saveAuthorization(configs, apikey, value)

        let keyStorage = `${KEY_PREFIX}${apikey}`
        let storage = localStorage.getItem(keyStorage)

        expect(storage).toBe(null)
    })  
})
