import LoadingSpin1 from '@renderer/components/Loading/LoadingSpin1'
import LoadingSpin2 from '@renderer/components/Loading/LoadingSpin2'
import LoadingEatBeans from '@renderer/components/Loading/LoadingEatBeans'

interface Props {
  title?: string
}
export const StartLoading: React.FC<Props> = (props) => {
  if (props.title) document.title = props.title

  return (
    <div className="loading-container overflow-hidden select-none rounded-10px w-screen h-screen  bg-#222 opacity-75">
      <LoadingSpin1 />
      {/* <LoadingSpin2 /> */}
      {/* <LoadingEatBeans /> */}
    </div>
  )
}

export default StartLoading
