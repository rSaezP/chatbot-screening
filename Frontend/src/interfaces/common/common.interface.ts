export interface RecordStatus {
  name: string
  className: string
  status: boolean
}

export interface PhantomKey {
  id: number
  status: boolean
}

export interface MetaDataBase {
  recordStatus: RecordStatus
  phantomKey: PhantomKey
}
