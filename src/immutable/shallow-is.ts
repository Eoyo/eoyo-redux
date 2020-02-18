import { is } from "immutable"

export function immutableShallowIs(
  f: { [x: string]: any },
  s: { [x: string]: any }
) {
  if (f === s) {
    return true
  }
  const keys1 = Object.keys(f)
  const keys2 = Object.keys(s)
  if (keys1.length !== keys2.length) {
    return false
  }
  return !keys1.some((one) => !is(f[one], s[one]))
}
