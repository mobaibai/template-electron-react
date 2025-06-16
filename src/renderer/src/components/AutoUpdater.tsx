import React from 'react'
import { Button, Progress, Alert, Space, Typography, Card, Divider } from 'antd'
import { DownloadOutlined, ReloadOutlined, CheckOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { useAutoUpdater } from '../hooks/useAutoUpdater'

const { Title, Text, Paragraph } = Typography

/**
 * 自动更新组件
 */
export const AutoUpdater: React.FC = () => {
  const { updateState, appVersion, checkForUpdates, quitAndInstall } = useAutoUpdater()

  const {
    checking,
    available,
    downloading,
    downloaded,
    error,
    progress,
    updateInfo
  } = updateState

  // 渲染更新状态
  const renderUpdateStatus = () => {
    if (error) {
      return (
        <Alert
          message="更新错误"
          description={error}
          type="error"
          icon={<ExclamationCircleOutlined />}
          showIcon
        />
      )
    }

    if (downloaded) {
      return (
        <Alert
          message="更新已下载完成"
          description={`新版本 ${updateInfo?.version} 已准备就绪，点击下方按钮重启应用完成安装。`}
          type="success"
          icon={<CheckOutlined />}
          showIcon
          action={
            <Button type="primary" onClick={quitAndInstall}>
              重启安装
            </Button>
          }
        />
      )
    }

    if (downloading && progress) {
      return (
        <div>
          <Alert
            message="正在下载更新"
            description={`下载新版本 ${updateInfo?.version} 中...`}
            type="info"
            icon={<DownloadOutlined />}
            showIcon
          />
          <div style={{ marginTop: 16 }}>
            <Progress
              percent={Math.round(progress.percent)}
              status="active"
              format={(percent) => `${percent}%`}
            />
            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
              <Text type="secondary">
                已下载: {(progress.transferred / 1024 / 1024).toFixed(2)} MB / 
                总大小: {(progress.total / 1024 / 1024).toFixed(2)} MB
              </Text>
            </div>
          </div>
        </div>
      )
    }

    if (available) {
      return (
        <Alert
          message="发现新版本"
          description={
            <div>
              <Paragraph>
                发现新版本 <Text strong>{updateInfo?.version}</Text>，当前版本: <Text code>{appVersion}</Text>
              </Paragraph>
              {updateInfo?.releaseNotes && (
                <Paragraph>
                  <Text type="secondary">更新说明:</Text>
                  <br />
                  <Text>{updateInfo.releaseNotes}</Text>
                </Paragraph>
              )}
            </div>
          }
          type="info"
          showIcon
        />
      )
    }

    if (checking) {
      return (
        <Alert
          message="正在检查更新"
          description="正在检查是否有新版本可用..."
          type="info"
          icon={<ReloadOutlined spin />}
          showIcon
        />
      )
    }

    return (
      <Alert
        message="当前已是最新版本"
        description={`当前版本: ${appVersion}`}
        type="success"
        icon={<CheckOutlined />}
        showIcon
      />
    )
  }

  return (
    <Card>
      <Title level={4}>应用更新</Title>
      <Divider />
      
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {renderUpdateStatus()}
        
        <Space>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />}
            onClick={checkForUpdates}
            loading={checking}
            disabled={downloading}
          >
            检查更新
          </Button>
          
          {downloaded && (
            <Button 
              type="default" 
              onClick={quitAndInstall}
            >
              立即重启安装
            </Button>
          )}
        </Space>
        
        <div style={{ fontSize: '12px', color: '#999' }}>
          <Text type="secondary">
            提示: 应用会在启动时自动检查更新。在生产环境中，更新将自动下载并提示安装。
          </Text>
        </div>
      </Space>
    </Card>
  )
}

export default AutoUpdater