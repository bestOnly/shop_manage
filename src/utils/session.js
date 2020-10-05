export default {
  get(k) {
    return sessionStorage.getItem(k)
  },
  set(k, v) {
    return sessionStorage.setItem(k, v)
  },
  remove(k) {
    return sessionStorage.removeItem(k)
  },
  clear() {
    return sessionStorage.clear()
  }
}
