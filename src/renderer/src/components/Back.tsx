import { SwapLeftOutlined } from '@ant-design/icons'

interface Props {
  className?: string
}
/**
 * @description: 返回
 * @return {type}
 */
export const Back: React.FC<Props> = ({ className }) => {
  return (
    <div className={`back-component flex ${className}`}>
      <div
        className="icon cursor-pointer hover:c-[var(--theme-primary)] transition-all duration-400"
        onClick={() => window.history.back()}
      >
        <SwapLeftOutlined />
      </div>
    </div>
  )
}

export default Back
