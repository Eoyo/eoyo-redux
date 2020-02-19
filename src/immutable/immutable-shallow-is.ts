import { is } from "immutable"

/**
 * 对于两个对象有的属性是 immutable 的数据结构进行 shallow compare.
 * @param first
 * @param second
 */
export function immutableShallowIs(
  first: { [x: string]: any },
  second: { [x: string]: any }
) {
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
