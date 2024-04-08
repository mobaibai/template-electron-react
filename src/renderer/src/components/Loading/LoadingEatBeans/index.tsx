import './index.scss'

interface Props {}
/**
 * @description: 糖豆人
 * @return {type}
 */
export const LoadingEatBeans: React.FC<Props> = () => {
  return (
    <div className="loading-eat-beans-component w-full h-full center bg-#222">
      <div className="pacman-loader" aria-live="polite"></div>
    </div>
  )
}

export default LoadingEatBeans
