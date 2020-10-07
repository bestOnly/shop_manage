export default function createTime(val) {
  const time = new Date(val)
  const y = time.getFullYear()
  const M = (time.getMonth() + 1).toString().padStart(2, 0)
  const d = time.getDate().toString().padStart(2, 0)
  const h = time.getHours().toString().padStart(2, 0)
  const m = time.getMinutes().toString().padStart(2, 0)
  const s = time.getSeconds().toString().padStart(2, 0)
  return `${y}-${M}-${d} ${h}:${m}:${s}`
}
