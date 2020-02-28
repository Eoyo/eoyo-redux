/* eslint-disable react/destructuring-assignment */
import React from "react"
import { objImmutableShallowIs } from "../immutable/immutable-shallow-is"

export class IComponent<P = {}, S = {}> extends React.Component<P, S> {
  shouldComponentUpdate(
    nextProps: Readonly<P>,
    nextState: Readonly<S>
  ): boolean {
    if (
      objImmutableShallowIs(this.props, nextProps) &&
      objImmutableShallowIs(this.state, nextState)
    ) {
      return false
    }
    return true
  }

  /**
   * 更新 state 上的某个字段的值.
   * @param updateKey 期望要更新的state 上的字段.
   * @param updater 对某个字段进行更新的函数, 其中 (data: 被更新的这个字段的值, state: 当前全部的 state)
   */
  updateAt<UpdateKey extends keyof S>(
    updateKey: UpdateKey,
    updater: (data: S[UpdateKey], state: S) => S[UpdateKey]
  ) {
    return this.setState((s) => {
      return {
        [updateKey]: updater(s[updateKey], s),
      } as any
    })
  }
}
