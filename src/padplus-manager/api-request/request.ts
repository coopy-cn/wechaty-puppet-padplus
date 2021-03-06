import AWS from 'aws-sdk'

import { log, AWS_S3 } from '../../config'
import { GrpcGateway } from '../../server-manager/grpc-gateway'
import { ApiType } from '../../server-manager/proto-ts/PadPlusServer_pb'
import { GrpcEventEmitter } from '../../server-manager/grpc-event-emitter'

export interface RequestOption {
  data?: any,
  apiType: ApiType,
}

const PRE = 'RequestClient'

export class RequestClient {

  private grpcGateway: GrpcGateway
  private emitter: GrpcEventEmitter

  constructor (grpcGateway: GrpcGateway, emitter: GrpcEventEmitter) {
    this.grpcGateway = grpcGateway
    this.emitter = emitter
  }

  public async request (option: RequestOption) {
    log.silly(PRE, `request()`)
    const uin = this.emitter.getUIN()
    const res = await this.grpcGateway.request(option.apiType, uin, option.data)
    return res
  }

  public async uploadFile (filename: string, stream: NodeJS.ReadableStream) {
    filename = decodeURIComponent(filename)
    let params: AWS.S3.PutObjectRequest = {
      ACL: 'public-read',
      Body: stream,
      Bucket: AWS_S3.BUCKET,
      Key: AWS_S3.PATH + filename,
    }
    AWS.config.accessKeyId = AWS_S3.ACCESS_KEY_ID
    AWS.config.secretAccessKey = AWS_S3.SECRET_ACCESS_KEY

    const s3 = new AWS.S3({ region: 'cn-northwest-1', signatureVersion: 'v4' })
    const result = await new Promise<AWS.S3.ManagedUpload.SendData>((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          log.silly(PRE, `data : ${JSON.stringify(data)}`)
          resolve(data)
        }
      })
    })
    const location = result.Location
    const _location = location.split('image-message')[0] + params.Key
    return _location
  }

}
