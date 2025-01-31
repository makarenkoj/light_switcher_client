class LocalStorageService {
  get isStorageAvailable () {
    if (this.isAvailable === undefined) {
      try {
        const x = '__storage_test__'
        localStorage.setItem(x, x)
        localStorage.removeItem(x)
        this.isAvailable = true
      } catch (e) {
        this.isAvailable = false
      }
    }

    return this.isAvailable
  }

  setItem (key, value) {
    if (this.isStorageAvailable) {
      localStorage.setItem(key, value)
    }
  }

  getItem (key) {
    if (this.isStorageAvailable) {
      return localStorage.getItem(key)
    }

    return null
  }

  clear () {
    if (this.isStorageAvailable) {
      localStorage.clear()
    }
  }
}

export const JWT_TOKEN = 'token'
export const USER = 'user'
export const USER_ID = 'userId'

export default LocalStorageService
