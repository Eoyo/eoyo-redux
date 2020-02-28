interface SingleDataModelActionsMapper<Data> {
  update(data: Data): Data
  clear(): undefined
}
