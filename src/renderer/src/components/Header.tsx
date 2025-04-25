import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import type { MenuItemType } from 'antd/es/menu/interface'

const menuItems: MenuProps['items'] = [
  {
    label: <NavLink to={'/index'}>{'首页'}</NavLink>,
    key: '/index'
  },
  {
    label: <NavLink to={'/about'}>{'关于'}</NavLink>,
    key: '/about'
  }
]
interface Props {}
export const Header: React.FC<Props> = () => {
  const _location = useLocation()
  const [menuCurrent, setMenuCurrent] = useState<string>(_location.pathname)

  useEffect(() => {
    menuItems.forEach((item: MenuItemType | any) => {
      if (_location.pathname.includes(item.key)) {
        setMenuCurrent(item.key)
      }
    })
  }, [_location.pathname])

  return (
    <div className="header-container">
      <div className="menu">
        <Menu
          theme="dark"
          className="center"
          selectedKeys={[menuCurrent]}
          mode="horizontal"
          items={menuItems}
        />
      </div>
    </div>
  )
}
