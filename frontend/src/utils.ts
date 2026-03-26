import { blue, red } from '@mui/material/colors'
import { pipe } from 'fp-ts/lib/function'
import { Accent, ThemeNarrowed } from './atoms/settings'
import type { RPCResponse, UploadConfig } from "./types"
import { ProcessStatus } from './types'

export function validateIP(ipAddr: string): boolean {
  let ipRegex = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/gm
  return ipRegex.test(ipAddr)
}

export function validateDomain(url: string): boolean {
  const urlRegex = /(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

  const [name, slug] = url.split('/')

  return urlRegex.test(url) || name === 'localhost' && slugRegex.test(slug)
}

export const ellipsis = (str: string, lim: number) =>
  str.length > lim
    ? `${str.substring(0, lim)}...`
    : str

export function toFormatArgs(codes: string[]): string {
  if (codes.length > 1) {
    return codes.reduce((v, a) => ` -f ${v}+${a}`)
  }
  if (codes.length === 1) {
    return ` -f ${codes[0]}`
  }
  return ''
}

const trimValue = (value: string) => value.trim()

const appendArg = (params: string[], key: string, value: string) => {
  const trimmed = trimValue(value)
  if (trimmed !== '') {
    params.push(`${key}=${trimmed}`)
  }
}

const appendBoolArg = (
  params: string[],
  key: string,
  value: boolean,
  defaultValue: boolean = false
) => {
  if (value !== defaultValue) {
    params.push(`${key}=${value ? 'true' : 'false'}`)
  }
}

export function getUploadValidationKey(config: UploadConfig): string | null {
  if (!config.enabled) {
    return null
  }

  switch (config.provider) {
    case 's3':
    case 'gcs':
      return trimValue(config.bucket) === ''
        ? 'uploadValidationBucket'
        : null
    case 'oss':
      if (trimValue(config.bucket) === '') {
        return 'uploadValidationBucket'
      }
      return trimValue(config.region) === ''
        ? 'uploadValidationRegion'
        : null
    case 'upyun':
      if (trimValue(config.service) === '') {
        return 'uploadValidationService'
      }
      if (trimValue(config.operator) === '') {
        return 'uploadValidationOperator'
      }
      return trimValue(config.password) === ''
        ? 'uploadValidationPassword'
        : null
    case 'rclone':
      return trimValue(config.remote) === ''
        ? 'uploadValidationRemote'
        : null
    default:
      return null
  }
}

export function buildUploadArgs(config: UploadConfig): string {
  if (!config.enabled) {
    return ''
  }

  const params: string[] = []

  switch (config.provider) {
    case 's3':
      appendArg(params, 'bucket', config.bucket)
      appendArg(params, 'key', config.key)
      if (trimValue(config.key) === '') {
        appendArg(params, 'prefix', config.prefix)
      }
      appendArg(params, 'endpoint_url', config.endpointUrl)
      appendArg(params, 'region_name', config.regionName)
      appendArg(params, 'aws_access_key_id', config.accessKeyId)
      appendArg(params, 'aws_secret_access_key', config.secretAccessKey)
      appendArg(params, 'profile_name', config.profileName)
      appendBoolArg(params, 'path_style', config.pathStyle)
      appendBoolArg(params, 'delete_local', config.deleteLocal)
      return `--use-postprocessor S3Upload:${params.concat('when=after_move').join(';')}`
    case 'gcs':
      appendArg(params, 'bucket', config.bucket)
      appendArg(params, 'key', config.key)
      if (trimValue(config.key) === '') {
        appendArg(params, 'prefix', config.prefix)
      }
      appendArg(params, 'project', config.project)
      appendArg(params, 'credentials_file', config.credentialsFile)
      appendArg(params, 'predefined_acl', config.predefinedAcl)
      appendBoolArg(params, 'delete_local', config.deleteLocal)
      return `--use-postprocessor GCSUpload:${params.concat('when=after_move').join(';')}`
    case 'oss':
      appendArg(params, 'bucket', config.bucket)
      appendArg(params, 'key', config.key)
      if (trimValue(config.key) === '') {
        appendArg(params, 'prefix', config.prefix)
      }
      appendArg(params, 'region', config.region)
      appendArg(params, 'endpoint', config.endpoint)
      appendArg(params, 'access_key_id', config.accessKeyId)
      appendArg(params, 'access_key_secret', config.accessKeySecret)
      appendArg(params, 'security_token', config.securityToken)
      appendBoolArg(params, 'delete_local', config.deleteLocal)
      return `--use-postprocessor OSSUpload:${params.concat('when=after_move').join(';')}`
    case 'upyun':
      appendArg(params, 'service', config.service)
      appendArg(params, 'key', config.key)
      if (trimValue(config.key) === '') {
        appendArg(params, 'prefix', config.prefix)
      }
      appendArg(params, 'operator', config.operator)
      appendArg(params, 'password', config.password)
      appendArg(params, 'endpoint', config.endpoint)
      appendArg(params, 'timeout', config.timeout)
      appendBoolArg(params, 'delete_local', config.deleteLocal)
      return `--use-postprocessor UpYunUpload:${params.concat('when=after_move').join(';')}`
    case 'rclone':
      appendArg(params, 'remote', config.remote)
      appendArg(params, 'target', config.target)
      if (trimValue(config.target) === '') {
        appendArg(params, 'prefix', config.prefix)
      }
      appendArg(params, 'rclone', config.rcloneBinary)
      appendBoolArg(params, 'delete_local', config.deleteLocal)
      return `--use-postprocessor RcloneUpload:${params.concat('when=after_move').join(';')}`
    default:
      return ''
  }
}

export function formatSize(bytes: number): string {
  const threshold = 1024
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  let i = 0
  while (bytes >= threshold) {
    bytes /= threshold
    i = i + 1
  }

  return `${bytes.toFixed(i == 0 ? 0 : 2)} ${units.at(i)}`
}

export const formatSpeedMiB = (val: number) =>
  `${(val / 1_048_576).toFixed(2)} MiB/s`

export const datetimeCompareFunc = (a: string, b: string) =>
  new Date(a).getTime() - new Date(b).getTime()

export function isRPCResponse(object: any): object is RPCResponse<any> {
  return 'result' in object && 'id' in object
}

export function mapProcessStatus(status: ProcessStatus) {
  switch (status) {
    case ProcessStatus.PENDING:
      return 'Pending'
    case ProcessStatus.DOWNLOADING:
      return 'Downloading'
    case ProcessStatus.COMPLETED:
      return 'Completed'
    case ProcessStatus.ERRORED:
      return 'Error'
    case ProcessStatus.LIVESTREAM:
      return 'Livestream'
    default:
      return 'Pending'
  }
}

export const prefersDarkMode = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches

export const base64URLEncode = (s: string) => pipe(
  s,
  s => String.fromCodePoint(...new TextEncoder().encode(s)),
  btoa,
  encodeURIComponent
)

export const getAccentValue = (accent: Accent, mode: ThemeNarrowed) => {
  switch (accent) {
    case 'default':
      return mode === 'light' ? blue[700] : blue[300]
    case 'red':
      return mode === 'light' ? red[600] : red[400]
    default:
      return mode === 'light' ? blue[700] : blue[300]
  }
}
