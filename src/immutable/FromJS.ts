import { List, fromJS } from "immutable"
import { TypedMap } from "./TypedMap"

export type TypedFromJS<T> = T extends (infer L)[]
  ? List<TypedFromJS<L>>
  : T extends { [key: string]: any }
  ? TypedMap<{ [x in keyof T]: TypedFromJS<T[x]> }>
  : T

export const typedFromJS: <T>(state: T) => TypedFromJS<T> = fromJS as any
