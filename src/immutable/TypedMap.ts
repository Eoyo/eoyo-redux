import { Map } from "immutable"

// @ts-ignore;
export interface TypedMap<T extends { [x: string]: any }>
  extends Map<keyof T, T[keyof T]> {
  get<Key extends keyof T>(k: Key): T[Key]
  set<Key extends keyof T>(k: Key, v: T[Key]): this
  merge<Key extends keyof T>(mergeObj: { [k in Key]: T[Key] }): this
  update<Key extends keyof T>(
    updateKey: Key,
    updater: (k: T[Key]) => T[Key]
  ): this
}

export const typedMap: <Obj>(obj: Obj) => TypedMap<Obj> = Map as any
