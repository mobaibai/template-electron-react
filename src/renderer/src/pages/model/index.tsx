import { memo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Stage,
  Environment,
  PerspectiveCamera,
  OrbitControls,
  useGLTF,
  useAnimations
} from '@react-three/drei'
import { useTitle } from '@renderer/hooks/useTitle'
import RobotGlb from '@renderer/assets/models/robot.glb'
import HdrWhite from '@renderer/assets/hdr/potsdamer_platz_1k.hdr'

const SceneContent = memo((props) => {
  const robotRef = useRef<any>(null)

  useFrame(() => {
    if (robotRef.current) {
      robotRef.current.rotation.y += 0.001
    }
  })

  return (
    <Stage environment={null} intensity={1}>
      {/* 加载本地HDR，动态控制并解决cdn加载报错问题 */}
      <Environment files={HdrWhite} />

      {/* 透视相机 */}
      <PerspectiveCamera makeDefault position={[1, 0, 0]} />

      {/* 控制 */}
      <OrbitControls />

      <group>
        {/* 自动旋转 */}
        <mesh ref={robotRef}>
          <RobotModel />
        </mesh>
      </group>
    </Stage>
  )
})

type Props = {
  title?: string
}
export const ModelPage: React.FC<Props> = (props) => {
  if (props.title) {
    useTitle(props.title)
  }

  return (
    <div className="model-container w-screen h-[calc(100vh-46px)]">
      <Canvas frameloop="always" shadows>
        <SceneContent />
      </Canvas>
    </div>
  )
}

useGLTF.preload(RobotGlb)
const RobotModel = () => {
  const { scene, animations } = useGLTF(RobotGlb) as any
  const { actions } = useAnimations(animations, scene)

  return <primitive object={scene} />
}

export default ModelPage
