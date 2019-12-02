import { ContactGender } from 'wechaty-puppet'
import { PadplusContactPayload, GrpcContactPayload, TagNewOrListResponse, TagNewOrListGrpcResponse } from '../schemas'

export const convertFromGrpcContact = (contactPayload: GrpcContactPayload, isSync?: boolean): PadplusContactPayload => {
  const payload: PadplusContactPayload = {
    alias            : contactPayload.Alias,
    bigHeadUrl       : contactPayload.BigHeadImgUrl,
    city             : contactPayload.City,
    contactFlag      : contactPayload.ContactFlag,
    contactType      : Number(contactPayload.ContactType),
    country          : '',
    tagList       : contactPayload.LabelLists,
    nickName         : contactPayload.NickName,
    province         : contactPayload.Province,
    remark           : contactPayload.RemarkName,
    sex              : contactPayload.Sex as ContactGender,
    signature        : contactPayload.Signature,
    smallHeadUrl     : contactPayload.SmallHeadImgUrl,
    stranger         : contactPayload.EncryptUsername,
    ticket           : '',
    userName         : contactPayload.UserName,
    verifyFlag       : contactPayload.VerifyFlag,
  }
  return payload
}

export const convertTagStr = (str: string): TagNewOrListResponse => {
  const tag: TagNewOrListGrpcResponse = JSON.parse(str)
  const _tag: TagNewOrListResponse = {
    count: tag.count,
    tagList: tag.labelList,
    loginer: tag.loginer,
    message: tag.message,
    queueName: tag.queueName,
    status: tag.status,
    uin: tag.uin,
  }
  return _tag
}