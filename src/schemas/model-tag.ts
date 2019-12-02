export interface TagGrpcPayload {
  LabelID: string,
  LabelName: string,
}

export interface TagNewOrListGrpcResponse {
  count: number,
  tagList: TagGrpcPayload[],
  loginer: string,
  message: string,
  queueName: string,
  status: number,
  uin: string,
}

export interface TagOtherOperationsGrpcResponse {
  loginer: string,
  message: string,
  queueName: string,
  status: number,
  uin: string,
  userName: string,
}