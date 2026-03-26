import { atomWithStorage } from 'jotai/utils'
import type { UploadConfig } from '../types'

export const defaultUploadConfig: UploadConfig = {
  enabled: false,
  provider: 's3',
  bucket: '',
  service: '',
  remote: '',
  key: '',
  prefix: '',
  deleteLocal: false,
  endpointUrl: '',
  regionName: '',
  accessKeyId: '',
  secretAccessKey: '',
  profileName: '',
  pathStyle: true,
  project: '',
  credentialsFile: '',
  predefinedAcl: '',
  region: '',
  endpoint: '',
  accessKeySecret: '',
  securityToken: '',
  operator: '',
  password: '',
  timeout: '',
  target: '',
  rcloneBinary: '',
}

export const uploadConfigState = atomWithStorage<UploadConfig>(
  'uploadConfig',
  defaultUploadConfig
)
