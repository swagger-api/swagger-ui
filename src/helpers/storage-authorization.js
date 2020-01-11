const KEY_PREFIX = "swagger-"

let localStorage = window.localStorage

export function saveAuthorization(configs, key, value) {
    if (configs.saveAuthorization) {
        localStorage.setItem(`${KEY_PREFIX}${key}`, value)
    }
}

export function deleteAuthorization(configs, key) {
    if (configs.saveAuthorization) {
        localStorage.removeItem(`${KEY_PREFIX}${key}`)
    }
}