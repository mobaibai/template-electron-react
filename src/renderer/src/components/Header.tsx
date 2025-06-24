import { useEffect, useState, useMemo } from 'react'
import { RouteItems } from '@renderer/router/config'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import type { ItemType } from 'antd/es/menu/interface'
import { NavLink, useLocation } from 'react-router-dom'

interface Props {}
export const Header: React.FC<Props> = () => {
  const location = useLocation()
  const [menuCurrent, setMenuCurrent] = useState<string>(location.pathname)

  // 使用 useMemo 避免在模块顶层访问 RouteItems
  const menuItems: MenuProps['items'] = useMemo(() => {
    const items: MenuProps['items'] = []
    RouteItems[0]?.children?.forEach(item => {
      items.push({
        label: <NavLink to={item.path}>{item.name}</NavLink>,
        key: item.path,
      })
    })
    return items
  }, [])

  useEffect(() => {
    menuItems?.forEach((item: ItemType | any) => {
      if (location.pathname.includes(item.key)) {
        setMenuCurrent(item.key)
      }
    })
  }, [location.pathname, menuItems])

  return (
    <div className="header-container">
      <div className="menu">
        <Menu
          selectedKeys={[menuCurrent]}
          mode="horizontal"
          items={menuItems}
        />
      </div>
    </div>
  )
}
