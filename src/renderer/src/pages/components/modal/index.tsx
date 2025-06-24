import { usePopup } from '@renderer/hooks/usePopup'
import { useTitle } from '@renderer/hooks/useTitle'

interface Props {
  title?: string
}
const Modal: React.FC<Props> = props => {
  if (props.title) useTitle(props.title)

  const { popup, show } = usePopup({
    children: (
      <div className="popup-content rainbow-text">这是一个全局弹窗</div>
    ),
  })

  return (
    <div className="modal-container p-10 flex justify-center">
      {popup}
      <span className="cursor-pointer rainbow-text" onClick={show}>
        弹窗演示
      </span>
    </div>
  )
}
export default Modal
