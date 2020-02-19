# eoyo-react-redux

在平时的项目开发中, 使用 react 结合 redux 很容易出现性能问题. 运行时的性能问题主要就是多做了无关的 diff 计算, 因此我们考虑使用 immutable 来优化数据结构, 从数据源头减少 diff 的计算.

本项目主要研究 react redux 结合 immutable 的设计方案, 旨在解决以下问题:
1. immutable 数据结构的类型安全问题.
2. immutable 环境下, react redux 项目的整体设计规范, 让代码美观简洁, 提高效率.


> **注意**: 
>1. 数据的结构使用 immutable 实现. 其中为了实现 `FromJS<T>` 的类型, 使用了复杂的递归类型, 要求 `typescript 3.7+`;

# 功能大纲


- [ ] model base
- [ ] selector template
- [ ] immutable model
- [ ] data schema
- [x] typed immutable
  - [x] `FromJs`, `ToJS` - 提供普通 js 对象和 Immutable 对象之间的类型转换.
  - [x] `typeMap`, `typedFromJS` - 对原始的 immutable 方法 加强类型.
- [x] immutable with react
  - [x] `immutableShallowIs` - 混有 immutable 数据结构的浅比较
  - [x] `IComponent` - 内置了使用 `immutableShallowIs` 对比数据是否变化的基本组件, 用于替代 React.PureComponent.

> 功能大纲中类似 `FromJS` 这种在**代码块**中的, 表示可以通过 `import { FromJS } from "eoyo-react-redux"` 获取到.

# 详细介绍

## typed immutable - 加强 immutable 数据结构的类型推断 

### 1. typedFromJS 和 toJS 方法.
功能和 `fromJS` 等价, 加强了类型:
`typedFromJS: (data: T) => FromJS<T>`

返回值的类型为`FromJS<T>`, 提供强大的类型推断, 要求typescript为 3.7+;

```ts
const appState = typedFromJs({
  money: 70,
  items: range(0, 60).map((one) => ({
    name: `${one}`,
    age: one,
  })),
})
```
则可以推断出 appState 的类型为
```ts
// typeof appState === 
TypedMap<{
    money: number;
    items: List<TypedMap<{
        name: string;
        age: number;
    }>>;
}>
```

typedFromJs 的类型推断规则:
```ts
// 规则-1: 数组推断为 List;
Value[] => List<Value>

// 规则-2: 对象推断为 TypedMap;
{ [x: Key]: Value } => TypedMap<{ [x: Key]: Value }>
```
不断的递归使用以上的规则. 可以推断普通的 JS 对象 在 fromJS 后生成的对应的 Immutable 的数据结构.

`ToJS<T>` 是相对于 `FromJS<T>` 相反的类型推断. 提供了 `toJS` 方法将 Immutable 的对象具有类型的转换为 普通 js 对象.

### 2. TypedMap. 加强了Immutable 原始的 Map 的类型.

`typedMap === Map`, 只是对类型进行了重载.

主要是对一下几个方法加强了类型: 
1. get
2. set
3. merge
4. update
5. toJS 

```ts
const test = typedMap<{ one: string; two: "two" }>({
  one: "one",
  two: "two",
})

test.set("one", "1") // ok
test.set("one", 1) // error, Argument of type '1' is not assignable to parameter of type 'string'.
test.set("ones", 1) // error, Argument of type '"ones"' is not assignable to parameter of type '"two" | "one"'
test.set("two", "2") // error, Argument of type '"2"' is not assignable to parameter of type '"two"'
```

> Immutable 4.0.0 中实现了 Record, 但是 Record 的构建速度不及 Map, 而且还不可以直接使用 fromJS 来生成 Immutable 的结构, 不方便持久化. 实际使用中只需要类型加强的 TypedMap 替代就好了. 

## Immutable with react - 使用 Immutable 优化 react 组件的性能.

主要是提供了一个 IComponent 组件, 继承自 React.Component, IComponent 内置了 shouldComponentUpdate 的计算, 以及提供了一些操作本地的 immutable state 的方法. 

1. 对于参数 props, 使用内置的 `immutableShallowIs` 进行比较, 允许 props 是一个 有的字段是 immutable 数据结构的浅比较.
2. 对于组件的状态 state, 也使用了 `immutableShallowIs` 进行比较, 允许 state 是一个 有的字段是 immutable 的数据结构

`IComponent` 中提供的新的方法:

1. IComponent.updateAt -- 更新 state 上的某个字段的值.

### `IComponent` 使用举例: 
```tsx
import React from "react"
import { range } from "ramda"
import { typedFromJS } from "../immutable/FromJS"
import { typedMap } from "../immutable/TypedMap"
import { Item } from "./test-item"
import { IComponent } from "../react/immutable-react"

// 1. 构建一段 immutable 的默认值
const AppState = typedFromJS({
  money: 70,
  items: range(0, 60).map((one) => ({
    name: `${one}`,
    age: one,
  })),
})

export class AppTest extends IComponent<
  {},
  {
    appState: typeof AppState
  }
> {
  state = {
    appState: AppState,
  }

  // 2. 定义成员方法, 使用 updateAt 辅助实现.
  addOne = () =>
    this.updateAt("appState", (s) =>
      s
        .update("money", (money) => money + 1)
        .update("items", (items) =>
          items.push(
            typedMap({
              name: "",
              age: s.get("money"),
            })
          )
        )
    )

  render() {
    const { appState } = this.state
    return (
      <div>
        {appState.get("money")}
        <button onClick={this.addOne} type="button">
          add
        </button>
        <div>
          {appState
            .get("items")
            .toArray()
            .map((one) => {
              return <Item key={one.get("age")} data={one} />
            })}
        </div>
      </div>
    )
  }
}
```