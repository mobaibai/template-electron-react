import React from 'react'

import { AnimationExamples } from '@renderer/components/Animations'
import { useTitle } from '@renderer/hooks/useTitle'

interface Props {
  title?: string
}
const AnimationsPage: React.FC<Props> = props => {
  if (props.title) useTitle(props.title)

  return (
    <div className="animations-page h-screen overflow-y-auto overflow-x-hidden">
      <div className="min-h-full pb-8">
        <AnimationExamples />
      </div>
    </div>
  )
}

export default AnimationsPage
