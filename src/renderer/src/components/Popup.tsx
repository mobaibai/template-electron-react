import { Modal } from 'antd'
import { CSSProperties, ReactNode } from 'react'

export interface PopupType {
  isOpen?: boolean
  title?: string
  maskClosable?: boolean
  width?: number | string
  className?: string
  style?: CSSProperties | undefined
  onCancel?: () => void
  children: ReactNode
}
const Popup: React.FC<PopupType> = ({
  title = '提示',
  isOpen,
  maskClosable = true,
  width,
  className,
  style,
  onCancel,
  children
}) => {
  return (
    <div className="popup-component">
      <Modal
        title={title}
        open={isOpen}
        maskClosable={maskClosable}
        width={width}
        wrapClassName={className}
        style={style}
        getContainer={false}
        footer={null}
        onCancel={onCancel}
      >
        {children}
      </Modal>
    </div>
  )
}
export default Popup
