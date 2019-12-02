import { log } from '../../config'
import { RequestClient } from './request'
import { ApiType } from '../../server-manager/proto-ts/PadPlusServer_pb'
import {
  GrpcSearchContact,
  TagGrpcPayload,
  TagNewOrListGrpcResponse,
  TagOtherOperationsGrpcResponse,
} from '../../schemas'

const PRE = 'PadplusContact'

export class PadplusContact {

  private requestClient: RequestClient
  constructor (requestClient: RequestClient) {
    this.requestClient = requestClient
  }

  public async getOrCreateTag (tag: string): Promise<string> {
    log.verbose(PRE, `getOrCreateTag(${tag})`)

    const data = {
      tag,
    }
    const result = await this.requestClient.request({
      apiType: ApiType.CREATE_LABEL,
      data,
    })
    if (result) {
      const tagGrpcResponseStr = result.getData()
      if (tagGrpcResponseStr) {
        const tagListGrpcResponse: TagNewOrListGrpcResponse = JSON.parse(tagGrpcResponseStr)
        let tagIDs = ''
        if (tagListGrpcResponse.labelList && tagListGrpcResponse.labelList.length > 0) {
          await Promise.all(tagListGrpcResponse.labelList.map((tagItem: TagGrpcPayload, index: number) => {
            if (index === tagListGrpcResponse.labelList.length - 1) {
              tagIDs += tagItem.LabelID
            } else {
              tagIDs += tagItem.LabelID + ','
            }
          }))
        }
        return tagIDs
      } else {
        throw new Error(`getOrCreateTag can not parse data`)
      }
    } else {
      throw new Error(`getOrCreateTag can not get callback result`)
    }
  }

  public async tagList (): Promise<TagGrpcPayload []> {
    log.verbose(PRE, `tagList()`)

    const result = await this.requestClient.request({
      apiType: ApiType.GET_ALL_LABEL,
    })
    if (result) {
      const tagGrpcResponseStr = result.getData()
      if (tagGrpcResponseStr) {
        const tagListGrpcResponse: TagNewOrListGrpcResponse = JSON.parse(tagGrpcResponseStr)

        return tagListGrpcResponse.labelList
      } else {
        throw new Error(`tagList can not parse data`)
      }
    } else {
      throw new Error(`tagList can not get callback result`)
    }
  }

  public async addTag (tagId: string, contactId: string): Promise<void> {
    log.verbose(PRE, `addTag(${tagId})`)

    const data = {
      labelIds: tagId,
      userName: contactId,
    }
    const result = await this.requestClient.request({
      apiType: ApiType.ADD_LABEL,
      data,
    })

    if (result) {
      const tagOperationsGrpcResponseStr = result.getData()
      if (tagOperationsGrpcResponseStr) {
        const tagOperationsGrpcResponse: TagOtherOperationsGrpcResponse = JSON.parse(tagOperationsGrpcResponseStr)
        if (tagOperationsGrpcResponse.status !== 0) {
          throw new Error(`Add operation failed!`)
        }
      } else {
        throw new Error(`addTag can not parse data`)
      }
    } else {
      throw new Error(`addTag can not get callback result`)
    }
  }

  public async modifyTag (tagId: string, name: string): Promise<void> {
    log.verbose(PRE, `modifyTag(${tagId}, ${name})`)

    const data = {
      labelId: tagId,
      labelName: name,
    }
    const result = await this.requestClient.request({
      apiType: ApiType.MODIFY_LABEL,
      data,
    })

    if (result) {
      const tagOperationsGrpcResponseStr = result.getData()
      if (tagOperationsGrpcResponseStr) {
        const tagOperationsGrpcResponse: TagOtherOperationsGrpcResponse = JSON.parse(tagOperationsGrpcResponseStr)
        if (tagOperationsGrpcResponse.status !== 0) {
          throw new Error(`Modify operation failed!`)
        }
      } else {
        throw new Error(`modifyTag can not parse data`)
      }
    } else {
      throw new Error(`modifyTag can not get callback result`)
    }
  }

  public async deleteTag (tagId: string): Promise<void> {
    log.verbose(PRE, `deleteTag(${tagId})`)

    const data = {
      labelIds: tagId,
    }
    const result = await this.requestClient.request({
      apiType: ApiType.DELETE_LABEL,
      data,
    })

    if (result) {
      const tagOperationsGrpcResponseStr = result.getData()
      if (tagOperationsGrpcResponseStr) {
        const tagOperationsGrpcResponse: TagOtherOperationsGrpcResponse = JSON.parse(tagOperationsGrpcResponseStr)
        if (tagOperationsGrpcResponse.status !== 0) {
          throw new Error(`Delete operation failed!`)
        }
      } else {
        throw new Error(`deleteTag can not parse data`)
      }
    } else {
      throw new Error(`deleteTag can not get callback result`)
    }
  }

  // Query contact list info
  public getContactInfo = async (userName: string): Promise<boolean> => {
    log.verbose(PRE, `getContactInfo(${userName})`)

    const data = {
      userName,
    }
    await this.requestClient.request({
      apiType: ApiType.GET_CONTACT,
      data,
    })
    return true
  }

  public searchContact = async (contactId: string): Promise<GrpcSearchContact> => {
    log.verbose(PRE, `searchContact(${contactId})`)

    const data = {
      wxid: contactId,
    }
    const result = await this.requestClient.request({
      apiType: ApiType.SEARCH_CONTACT,
      data,
    })

    if (result) {
      const contactStr = result.getData()
      if (contactStr) {
        return JSON.parse(contactStr)
      } else {
        throw new Error(`can not parse data`)
      }
    } else {
      throw new Error(`can not get callback result`)
    }
  }

  // Set alias for contact
  public setAlias = async (contactId: string, alias: string): Promise<boolean> => {
    log.verbose(PRE, `setAlias()`)

    const data = {
      newRemarkName: alias,
      userName: contactId,
    }

    await this.requestClient.request({
      apiType: ApiType.CONTACT_ALIAS,
      data,
    })
    return true
  }

  public syncContacts = async (): Promise<void> => {
    log.verbose(PRE, `syncContacts()`)

    await this.requestClient.request({
      apiType: ApiType.SYNC_CONTACT,
    })
  }

}
