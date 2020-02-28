import { immutableShallowIs, typedMap } from "src"

describe("immutable shallow is test", () => {
  it("not object", () => {
    expect(immutableShallowIs(undefined, null)).toBe(false)
    expect(immutableShallowIs(undefined, {})).toBe(false)
    expect(immutableShallowIs({}, null)).toBe(false)
    expect(immutableShallowIs("1231", "1121")).toBe(false)
    expect(immutableShallowIs("1231", 1231)).toBe(false)
    expect(immutableShallowIs("[]", [])).toBe(false)
    expect(immutableShallowIs([], [])).toBe(true)
    expect(immutableShallowIs([1], [1])).toBe(true)
    expect(immutableShallowIs([123], [123])).toBe(true)

    expect(immutableShallowIs(undefined, undefined)).toBe(true)
    expect(immutableShallowIs(null, null)).toBe(true)
    expect(immutableShallowIs("1231", "1231")).toBe(true)
  })
  it("normal obj", () => {
    const a = {
      a: "a",
    }
    const b = {
      b: "b",
    }
    const b1 = {
      b: "b",
    }
    expect(immutableShallowIs(b, b1)).toBe(true)
    expect(immutableShallowIs({ a }, { a })).toBe(true)
    expect(immutableShallowIs({ b }, { b: b1 })).toBe(false)
    expect(immutableShallowIs({ b: undefined }, { b: null })).toBe(false)
    expect(immutableShallowIs({ b }, b1)).toBe(false)
  })
  it("immutable obj", () => {
    const d1 = typedMap({ a: "1" })
    const d2 = typedMap({ a: "1" })
    expect(immutableShallowIs({ a: d1 }, { a: d2 })).toBe(true)
  })
})
