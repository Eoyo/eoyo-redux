// 去除 immutable 的原始js 数据结构
// 支持 Record, Set, Map, List.
import { Set, List, Collection } from "immutable"
import { TypedMap } from "./TypedMap"

/**
 * 从 immutable 数据结构中推断出对应的 `普通 JS 对象` 的类型.
 */
export type ToJS<ImmutableObj> = ImmutableObj extends List<infer ListType>
  ? ToJS<ListType>[]
  : ImmutableObj extends Set<infer SetType>
  ? ToJS<SetType>[]
  : ImmutableObj extends TypedMap<infer MapType>
  ? {
      [x in keyof MapType]: ToJS<MapType[x]>
    }
  : ImmutableObj

/**
 * 去得 Immutable 数据结构对应的 js 对象.
 * @param iObj immutable 的数据对象.
 */
export function toJS<ImmutableObj extends Collection<any, any>>(
  iObj: ImmutableObj
): ToJS<ImmutableObj> {
  return iObj.toJS() as any
}
