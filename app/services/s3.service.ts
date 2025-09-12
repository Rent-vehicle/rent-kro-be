import { DlnS3, S3ACL, S3Operation } from '@devslane/node-s3-wrapper'
import {
  AWS_ACCESS_KEY_ID,
  AWS_BUCKET_NAME,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
} from '../utils/secret.js'

export enum S3Directories {
  VEHICLE_IMAGES = 'vehicle/images',
  VEHICLE_DOCUMENTS = 'vehicle/documents',
  VEHICLE_RC = 'vehicle/rc',
  VEHICLE_INSURANCE = 'vehicle/insurance',
  VEHICLE_PERMIT = 'vehicle/permit',
  VEHICLE_PUC = 'vehicle/puc',
  VEHICLE_OTHER = 'vehicle/other',

  // User related directories
  USER_AVATAR = 'user/avatar',
  USER_AADHAR = 'user/aadhar',
  USER_PAN = 'user/pan',
  USER_PROFILE = 'user/profile',
  USER_ADDRESS_PROOF = 'user/address-proof',
  USER_OTHER = 'user/other',
  USER_DRIVING_LICENSE = 'user/driving-license',
}

class S3Service {
  public isBooted: boolean
  public dlnS3: DlnS3 | null

  constructor() {
    this.isBooted = false
    this.dlnS3 = null
    this.boot() // Boot the S3 service as soon as the instance is created
  }

  static getInstance(): S3Service {
    return new S3Service()
  }

  boot(): void {
    if (!this.isBooted) {
      this.dlnS3 = DlnS3.create({
        secret: AWS_SECRET_ACCESS_KEY,
        key: AWS_ACCESS_KEY_ID,
        region: AWS_REGION,
        bucket: AWS_BUCKET_NAME,
      })
      this.isBooted = true
    }
  }

  getPreSignedUrl(data: {
    file_name: string
    for: string
    content_type: string
    customMeta: object
  }): string {
    const options = {
      directory: data.for,
      acl: S3ACL.PUBLIC_READ,
      contentType: data.content_type,
      customMeta: data.customMeta,
    }
    this.dlnS3
    return this.dlnS3!.getSignedUrl(S3Operation.PUT_OBJECT, data.file_name, options, 3200)
  }

  async uploadFile(
    file: Buffer,
    directory: string,
    fileName: string,
    contentType: string
  ): Promise<string> {
    const namespace = `${directory}/${fileName}` // path
    let uploadOptions = { contentType: contentType }

    const res = await this.dlnS3!.upload(file, namespace, uploadOptions)
    return res.Location
  }
}

export const s3Service = S3Service.getInstance()
