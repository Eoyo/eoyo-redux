import { createAction, Action } from "redux-actions"

/**
 * 定义一批的 actions, 使得其 type 具有统一的命名空间作为前缀.
 * @param modelName 模块的名字
 * @param actionsMapper 每个 action 的 payload 的生成函数.
 */
export const defineActions = <T extends { [x: string]: (...args: any) => any }>(
  modelName: string,
  actionsMapper: T
): {
  [x in keyof T]: T[x] extends (...args: infer Args) => infer Result
    ? (...args: Args) => Action<Result>
    : never
} => {
  const keys = Object.keys(actionsMapper)
  const result = {} as any
  keys.forEach((oneKey) => {
    result[oneKey] = createAction(
      `${modelName}/${oneKey}`,
      actionsMapper[oneKey]
    )
  })
  return result
}
