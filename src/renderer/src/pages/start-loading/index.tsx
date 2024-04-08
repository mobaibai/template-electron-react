// @ts-ignore
import LoadingSpin1 from '@renderer/components/Loading/LoadingSpin1'
// @ts-ignore
import LoadingSpin2 from '@renderer/components/Loading/LoadingSpin2'
// @ts-ignore
import LoadingEatBeans from '@renderer/components/Loading/LoadingEatBeans'

interface Props {
  title?: string
}
export const StartLoading: React.FC<Props> = (props) => {
  if (props.title) document.title = props.title

  return (
    <div className="loading-container overflow-hidden select-none rounded-10px w-screen h-screen  bg-#222 opacity-85">
      <LoadingSpin1 />
      {/* <LoadingSpin2 /> */}
      {/* <LoadingEatBeans /> */}
    </div>
  )
}

export default StartLoading
