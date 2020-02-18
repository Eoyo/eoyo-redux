import { List, fromJS } from "immutable"
import { TypedMap } from "./TypedMap"

export type FromJS<T> = T extends (infer L)[]
  ? List<FromJS<L>>
  : T extends { [key: string]: any }
  ? TypedMap<{ [x in keyof T]: FromJS<T[x]> }>
  : T

export const typedFromJs: <T>(state: T) => FromJS<T> = fromJS as any
