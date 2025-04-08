import { jwtDecode } from 'jwt-decode';

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

  getUserRole() {
    const token = this.getItem(JWT_TOKEN);
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      return decoded.role || "user";
    } catch (err) {
      return "user";
    }
  }
}

export const JWT_TOKEN = 'token'
export const USER = 'user'
export const USER_ID = 'userId'

export default LocalStorageService
