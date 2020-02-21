/* eslint-disable no-restricted-syntax */
import { fromJS, Map } from "immutable"
import { defineActions } from "../actions/define-actions"
import { reduceActions } from "../actions/reduce-actions"
import { TypedMap } from "../immutable/TypedMap"
import { ToJS } from "../immutable/ToJS"

/**
 *
 */
export function MapDataModel<iData extends TypedMap<any>>(
  modelName: string,
  initState: () => TypedMap<{ [x: string]: iData }>,
  {
    identify,
    rangeValue,
  }: {
    identify: (data: ToJS<iData>) => string
    /** 计算数据所属的区间值, 用于区间数据同步算法 */
    rangeValue: (data: iData) => number
  }
) {
  type Data = ToJS<iData>
  const action = defineActions(modelName, {
    update: (id: string, data: Partial<Data>) => ({ id, data }),
    someUpdate: (updateArray: [string, Partial<Data>][]) => ({
      updateArray,
    }),
    add: (data: Data) => data,
    /**
     * @param data 添加的数据
     * @param rangeStart 这次添加的数据数据所属的区间开始位置.
     * @param rangeEnd  这次添加的数据所属的区间结束位置.
     */
    someAdd: (data: Data[], rangeStart?: number, rangeEnd?: number) => ({
      data,
      rangeStart,
      rangeEnd,
    }),
    delete: (id: string) => id,
    someDelete: (ids: string[]) => ids,
  })
  const reducer = reduceActions(
    initState(),
    action
  )({
    /** 更新已经存在的数据 */
    update: (state, { id, data }) => {
      return state.update(id, (one) => one.merge(fromJS(data) as any))
    },
    someUpdate: (state, { updateArray }) => {
      let s = state
      updateArray.forEach(([id, data]) => {
        s = s.update(id, (one) => one.merge(fromJS(data) as any))
      })
      return s
    },
    add: (state, data) => state.set(identify(data), fromJS(data as any)),
    someAdd: (state, { data, rangeStart, rangeEnd }) => {
      const newInRangeData = Map(
        data.map((oneData) => [identify(oneData), fromJS(oneData)])
      )

      // 区间同步算法, 可以及时的删除本地冗余的数据.
      if (
        rangeStart !== undefined &&
        rangeEnd !== undefined &&
        rangeEnd >= rangeStart
      ) {
        const oldInRangeData = state.filter((oneData) => {
          const v = rangeValue(oneData)
          return v >= rangeStart && v <= rangeEnd
        })
        const toDeleteKeys: string[] = []
        for (const x of oldInRangeData.keys()) {
          if (!newInRangeData.has(x as string)) {
            toDeleteKeys.push(x as string)
          }
        }
        // 删除旧的区间中有但是新的区间中没有的数据.
        return state.merge(newInRangeData).deleteAll(toDeleteKeys)
      }

      return state.merge(newInRangeData)
    },
    delete: (state, id) => state.delete(id),
    someDelete: (state, ids) => state.deleteAll(ids),
  })
  return {
    action,
    reducer,
  }
}
