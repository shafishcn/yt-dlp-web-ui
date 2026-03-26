import {
  Alert,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material'
import { useAtom } from 'jotai'
import { uploadConfigState } from '../atoms/upload'
import type { UploadConfig, UploadProvider } from '../types'
import { useI18n } from '../hooks/useI18n'

const UploadOptions: React.FC = () => {
  const { i18n } = useI18n()
  const [config, setConfig] = useAtom(uploadConfigState)

  const setValue = <K extends keyof UploadConfig>(key: K, value: UploadConfig[K]) => {
    setConfig({
      ...config,
      [key]: value,
    })
  }

  const handleProviderChange = (event: SelectChangeEvent<UploadProvider>) => {
    setValue('provider', event.target.value as UploadProvider)
  }

  return (
    <Paper
      elevation={2}
      sx={{
        mt: 2,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      <Typography variant="h6">
        {i18n.t('uploadConfigTitle')}
      </Typography>
      <Alert severity="info">
        {i18n.t('uploadConfigHelp')}
      </Alert>
      <FormControlLabel
        control={
          <Checkbox
            checked={config.enabled}
            onChange={(event) => setValue('enabled', event.target.checked)}
          />
        }
        label={i18n.t('uploadEnable')}
      />
      {config.enabled && (
        <Grid container spacing={1.5}>
          <Grid item xs={12} md={4}>
            <Select
              fullWidth
              value={config.provider}
              onChange={handleProviderChange}
            >
              <MenuItem value="s3">{i18n.t('uploadProviderS3')}</MenuItem>
              <MenuItem value="gcs">{i18n.t('uploadProviderGCS')}</MenuItem>
              <MenuItem value="oss">{i18n.t('uploadProviderOSS')}</MenuItem>
              <MenuItem value="upyun">{i18n.t('uploadProviderUpYun')}</MenuItem>
              <MenuItem value="rclone">{i18n.t('uploadProviderRclone')}</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label={i18n.t('uploadKey')}
              value={config.key}
              onChange={(event) => setValue('key', event.target.value)}
              placeholder="videos/%(uploader)s/%(title)s.%(ext)s"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={i18n.t('uploadPrefix')}
              value={config.prefix}
              onChange={(event) => setValue('prefix', event.target.value)}
              placeholder="videos/%(uploader)s"
              helperText={i18n.t('uploadPrefixHelp')}
            />
          </Grid>
          {config.provider === 's3' && (
            <>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={i18n.t('uploadBucket')}
                  value={config.bucket}
                  onChange={(event) => setValue('bucket', event.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={i18n.t('uploadEndpointUrl')}
                  value={config.endpointUrl}
                  onChange={(event) => setValue('endpointUrl', event.target.value)}
                  placeholder="https://s3.api.upyun.com"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={i18n.t('uploadRegionName')}
                  value={config.regionName}
                  onChange={(event) => setValue('regionName', event.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={i18n.t('uploadAccessKeyId')}
                  value={config.accessKeyId}
                  onChange={(event) => setValue('accessKeyId', event.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="password"
                  label={i18n.t('uploadSecretAccessKey')}
                  value={config.secretAccessKey}
                  onChange={(event) => setValue('secretAccessKey', event.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={i18n.t('uploadProfileName')}
                  value={config.profileName}
                  onChange={(event) => setValue('profileName', event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={config.pathStyle}
                      onChange={(event) => setValue('pathStyle', event.target.checked)}
                    />
                  }
                  label={i18n.t('uploadPathStyle')}
                />
              </Grid>
            </>
          )}
          {config.provider === 'gcs' && (
            <>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={i18n.t('uploadBucket')}
                  value={config.bucket}
                  onChange={(event) => setValue('bucket', event.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={i18n.t('uploadProject')}
                  value={config.project}
                  onChange={(event) => setValue('project', event.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={i18n.t('uploadPredefinedAcl')}
                  value={config.predefinedAcl}
                  onChange={(event) => setValue('predefinedAcl', event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={i18n.t('uploadCredentialsFile')}
                  value={config.credentialsFile}
                  onChange={(event) => setValue('credentialsFile', event.target.value)}
                  placeholder="/config/gcs-service-account.json"
                />
              </Grid>
            </>
          )}
          {config.provider === 'oss' && (
            <>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={i18n.t('uploadBucket')}
                  value={config.bucket}
                  onChange={(event) => setValue('bucket', event.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={i18n.t('uploadRegion')}
                  value={config.region}
                  onChange={(event) => setValue('region', event.target.value)}
                  placeholder="cn-hangzhou"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={i18n.t('uploadEndpoint')}
                  value={config.endpoint}
                  onChange={(event) => setValue('endpoint', event.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={i18n.t('uploadAccessKeyId')}
                  value={config.accessKeyId}
                  onChange={(event) => setValue('accessKeyId', event.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="password"
                  label={i18n.t('uploadAccessKeySecret')}
                  value={config.accessKeySecret}
                  onChange={(event) => setValue('accessKeySecret', event.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={i18n.t('uploadSecurityToken')}
                  value={config.securityToken}
                  onChange={(event) => setValue('securityToken', event.target.value)}
                />
              </Grid>
            </>
          )}
          {config.provider === 'upyun' && (
            <>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={i18n.t('uploadService')}
                  value={config.service}
                  onChange={(event) => setValue('service', event.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={i18n.t('uploadOperator')}
                  value={config.operator}
                  onChange={(event) => setValue('operator', event.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="password"
                  label={i18n.t('uploadPassword')}
                  value={config.password}
                  onChange={(event) => setValue('password', event.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={i18n.t('uploadEndpoint')}
                  value={config.endpoint}
                  onChange={(event) => setValue('endpoint', event.target.value)}
                  placeholder="v0.api.upyun.com"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={i18n.t('uploadTimeout')}
                  value={config.timeout}
                  onChange={(event) => setValue('timeout', event.target.value)}
                  placeholder="30"
                />
              </Grid>
            </>
          )}
          {config.provider === 'rclone' && (
            <>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={i18n.t('uploadRemote')}
                  value={config.remote}
                  onChange={(event) => setValue('remote', event.target.value)}
                  placeholder="upyun:archive"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={i18n.t('uploadTarget')}
                  value={config.target}
                  onChange={(event) => setValue('target', event.target.value)}
                  placeholder="%(uploader)s/%(title)s.%(ext)s"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={i18n.t('uploadRcloneBinary')}
                  value={config.rcloneBinary}
                  onChange={(event) => setValue('rcloneBinary', event.target.value)}
                  placeholder="rclone"
                />
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={config.deleteLocal}
                  onChange={(event) => setValue('deleteLocal', event.target.checked)}
                />
              }
              label={i18n.t('uploadDeleteLocal')}
            />
          </Grid>
        </Grid>
      )}
    </Paper>
  )
}

export default UploadOptions
