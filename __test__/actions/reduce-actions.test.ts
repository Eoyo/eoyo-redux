import { reduceActions, defineActions } from "src"

describe("handleActions test", () => {
  const ac = defineActions("Ac1", {
    test1: (name: string) => ({ name }),
    test2: (name: string, age: number) => ({ name, age }),
  })
  const ac2 = defineActions("Ac2", {
    test1: (name: string) => ({ name }),
  })
  const reducers = reduceActions(
    { name: "", age: 0 },
    ac
  )({
    test1: (s, p) => {
      return { ...s, name: p.name }
    },
    test2(s, p) {
      return {
        ...s,
        ...p,
      }
    },
  })
  it("使用 test 1 只修改名字", () => {
    const ns = reducers({ name: "1", age: 1 }, ac.test1("2"))
    expect(ns).toStrictEqual({ name: "2", age: 1 })
  })
  it("使用 test 2 同时修改名字和年龄", () => {
    const ns = reducers({ name: "1", age: 1 }, ac.test2("2", 2))
    expect(ns).toStrictEqual({ name: "2", age: 2 })
  })
  it("没有传递 初始state 的时候使用默认的state", () => {
    const ns = reducers(undefined, ac.test1("2"))
    expect(ns).toStrictEqual({ name: "2", age: 0 })
  })
  it("传入不相关的action的时候, state 不变", () => {
    const s0 = { name: "1", age: 1 }
    const s1 = reducers(s0, ac2.test1("2"))
    expect(s1).toBe(s0)
  })
})
