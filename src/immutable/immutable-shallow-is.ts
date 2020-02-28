import { is } from "immutable"

/**
 * 对于两个对象有的属性是 immutable 的数据结构进行 shallow compare.
 * @param first
 * @param second
 */
export function immutableShallowIs(first: any, second: any) {
  if (first === second) {
    return true
  }
  if (
    typeof first === "object" &&
    typeof second === "object" &&
    first !== null &&
    second !== null
  ) {
    const a = Array.isArray(first)
    const b = Array.isArray(second)
    if (a !== b) {
      return false
    }
    if (a && b) {
      return !first.some((one: any, index: any) => {
        return !is(one, second[index])
      })
    }
    return objImmutableShallowIs(first, second)
  }
  return first === second
}

export function objImmutableShallowIs(first: any, second: any) {
  if (first === second) {
    return true
  }
  const keys1 = Object.keys(first)
  const keys2 = Object.keys(second)
  if (keys1.length !== keys2.length) {
    return false
  }
  return !keys1.some((one) => !is(first[one], second[one]))
}
