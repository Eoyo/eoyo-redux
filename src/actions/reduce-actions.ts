import { Action } from "redux-actions"

type ActionPayloadHandler<ActionCreator, State> = ActionCreator extends (
  ...args: any
) => Action<infer Payload>
  ? (state: State, payload: Payload) => State
  : never

/** 构建一个从指定的 caseObj 中选择 reducer 的 reducer */
function buildCaseObjReducer<State>(
  state: State,
  caseObj: { [x: string]: (s: State, ac: any) => State }
) {
  return (s = state, ac: { type: string; payload?: any }): State => {
    const caseReducer = caseObj[ac.type]
    if (!caseReducer) {
      // 没有 reducer 匹配 > 不处理state;
      return s
    }
    return caseReducer(s, ac.payload)
  }
}

/**
 * 将一批 action 处理为对数据 state 的归约.
 * @param state 初始的 state
 * @param actionsMapper 每个action的处理函数;
 */
export const reduceActions = <S, M>(state: S, actionsMapper: M) => (
  reducersMapper: {
    [x in keyof M]: ActionPayloadHandler<M[x], S>
  }
) => {
  const caseObj: any = {}

  // 构造每个 action 对应的 reducer.
  Object.keys(actionsMapper).forEach((actionKey) => {
    const oneActionCreator = (actionsMapper as any)[actionKey]
    const oneActionHandler = (reducersMapper as any)[actionKey]
    if (typeof oneActionHandler === "function") {
      caseObj[oneActionCreator.toString()] = oneActionHandler
    }
  })

  return buildCaseObjReducer(state, caseObj)
}
