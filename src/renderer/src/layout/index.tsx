import { Outlet } from 'react-router-dom'

interface Props {
}
export const LayoutPage: React.FC<Props> = () => {

  return (
    <div className="layout-container">
      <Outlet />
    </div>
  )
}