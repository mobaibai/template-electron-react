import { Header } from '@renderer/components/Header'
import { Outlet } from 'react-router-dom'

interface Props {}
export const LayoutPage: React.FC<Props> = () => {
  return (
    <div className="layout-container w-full h-screen flex flex-col">
      <Header />
      <div className="router-content flex-1">
        <Outlet />
      </div>
    </div>
  )
}
