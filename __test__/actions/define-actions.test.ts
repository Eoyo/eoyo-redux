import { defineActions } from "src"

describe("defineActions test", () => {
  const modelName = "Test"
  const ac = defineActions(modelName, {
    test1: (name) => ({ name }),
    test2: (name = "", age = 0) => ({ name, age }),
  })
  it("action creator 具有toString() 的方法", () => {
    expect(ac.test1.toString()).toBe(`${modelName}/test1`)
  })
  it("action creator 可以创建正确的 action", () => {
    const a = ac.test1("ttt")
    expect(a.type).toBe(`${modelName}/test1`)
    expect(a.payload).toEqual({ name: "ttt" })
    expect(a.error).toBe(undefined)
  })
  it("defineActions 只创建对应键的action creator", () => {
    const keys = Object.keys(ac)
    expect(keys).toStrictEqual(["test1", "test2"])
  })
})
