import { MapDataModel, typedFromJS } from "src"

describe("map data model", () => {
  const initDefaultState = () => {
    return typedFromJS({
      test: {
        id: "test",
        name: "1",
        age: 23,
        friend: ["21", "21"],
      },
    })
  }
  const a = MapDataModel("Test", initDefaultState, {
    rangeValue(one) {
      return one.get("age")
    },
    identify(one) {
      return one.id
    },
  })
  const s = initDefaultState()
  it("test add", () => {
    const s1 = a.reducer(
      s,
      a.action.add({ id: "1", age: 10, name: "123", friend: [] })
    )
    expect(s1.get("1").get("age")).toBe(10)
  })
  it("test update", () => {
    const s1 = a.reducer(s, a.action.update("test", { age: 11 }))
    expect(s1.get("test").get("age")).toBe(11)
  })
  it("test some update", () => {
    const s1 = a.reducer(
      s,
      a.action.add({ id: "1", age: 10, name: "123", friend: [] })
    )
    const s2 = a.reducer(
      s1,
      a.action.someUpdate([
        ["test", { age: -1 }],
        ["1", { age: -2 }],
      ])
    )
    expect(s2.get("test").get("age")).toBe(-1)
    expect(s2.get("1").get("age")).toBe(-2)
  })
  it("some add, show delete the old data in the range", () => {
    const s1 = a.reducer(
      s,
      a.action.add({ id: "1", age: 10, name: "123", friend: [] })
    )

    expect(s1.get("1").get("name")).toBe("123")

    const s2 = a.reducer(
      s1,
      a.action.someAdd(
        [
          { id: "2", age: 9, name: "xiaobing", friend: ["1"] },
          { id: "3", age: 10, name: "dalao", friend: ["2"] },
        ],
        9,
        11
      )
    )
    expect(s2.get("1")).toBe(undefined)
    expect(
      s2
        .get("2")
        .get("friend")
        .get(0)
    ).toBe("1")
    expect(
      s2
        .get("3")
        .get("friend")
        .get(0)
    ).toBe("2")
    expect(s2.count()).toBe(3)
  })
})
