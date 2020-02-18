/* eslint-disable react/destructuring-assignment */
import React from "react"
import { is } from "immutable"
import { immutableShallowIs } from "../immutable/shallow-is"

export abstract class IComponent<P = {}, S = {}> extends React.Component<
  P,
  { i: S }
> {
  /** immutableState 的便捷引用 */
  iState: S
  constructor(props: P, context?: any) {
    super(props, context)
    this.iState = this.initImmutableState(props)
    this.state = {
      i: this.iState,
    }
  }

  shouldComponentUpdate(
    nextProps: Readonly<P>,
    nextState: Readonly<{ i: S }>
  ): boolean {
    if (
      immutableShallowIs(this.props, nextProps) &&
      is(this.state.i, nextState.i)
    ) {
      return false
    }
    return true
  }

  update(updater: (s: S) => S) {
    // 由于 replaceState api 被废弃, 且setState 中 state 必须为普通的对象, 所以使用 immutableState存储 immutable 的数据.
    this.setState((s) => {
      return {
        i: updater(s.i),
      }
    })
  }

  updateWith<UProps extends any[] = []>(
    updater: (s: S, ...updateProps: UProps) => S
  ) {
    return (...p: UProps) => {
      this.setState((s) => {
        const updatedState = updater(s.i, ...p)
        this.iState = updatedState
        return {
          i: updatedState,
        }
      })
    }
  }

  abstract initImmutableState(props: P): S
}
