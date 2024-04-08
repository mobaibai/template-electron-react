import { lazy, useState } from 'react'
import ReactDOM from 'react-dom'
import { PopupType } from '@renderer/components/Popup'

const Popup = lazy(() => import('@renderer/components/Popup'))

export const usePopup = (options: PopupType) => {
  const { isOpen = false, title, maskClosable, width, className, style, children } = options
  const [open, setOpen] = useState(isOpen)
  const popup = ReactDOM.createPortal(
    <Popup
      isOpen={open}
      title={title}
      maskClosable={maskClosable}
      width={width}
      className={className}
      style={style}
      onCancel={() => setOpen(false)}
    >
      {children}
    </Popup>,
    document.getElementById('root') as HTMLElement
  )
  return {
    popup,
    show() {
      setOpen(true)
    },
    hide() {
      setOpen(false)
    },
    toggle() {
      setOpen(!open)
    }
  }
}
