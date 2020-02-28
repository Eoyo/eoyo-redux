interface SpaceMapModelActionsAddOptions {
  rangeStart?: number
  rangeEnd?: number
}

interface SpaceMapModelActionsMapper<Data> {
  // 添加的操作.
  add(
    spaceId: string,
    id: string,
    data: Data
  ): { spaceId: string; id: string; data: Data }
  someAdd(
    spaceId: string,
    data: Data[],
    opt: SpaceMapModelActionsAddOptions
  ): SpaceMapModelActionsAddOptions & {
    spaceId: string
    data: Data[]
  }

  // 修改的操作
  update(
    spaceId: string,
    id: string,
    data: Partial<Data>
  ): { spaceId: string; id: string; data: Partial<Data> }

  // 删除的操作
  delete(
    spaceId: string,
    id: string
  ): {
    spaceId: string
    id: string
  }
  someDelete(
    spaceId: string,
    ids: string[]
  ): {
    spaceId: string
    ids: string[]
  }
  spaceDelete(spaceId: string): { spaceId: string }
  someSpaceDelete(spaceIds: string[]): { spaceIds: string[] }
  clear(): undefined
}
