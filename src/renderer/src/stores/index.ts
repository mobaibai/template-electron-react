import { create } from 'zustand'
import { getStorage, removeStorage, setStorage } from '@renderer/storage'

type Loading = {
  loadingOpen: boolean
  setLoadingOpen: (loadingOpen: boolean) => void
}
/**
 * @description: 设置Loading
 * @param {type} create
 * @return {type}
* @example:
 * const { loadingOpen, setLoadingOpen } = useLoadingStore()
 * --HTML--
 * <div className='loading-container'>
 *   <button onClick={() => setLoadingOpen(true)}>打开Loading</button>
 *   <button onClick={() => setLoadingOpen(false)}>关闭Loading</button>
 *   {loadingOpen && <Loading />}
 * </div>
 */
export const useLoadingStore = create<Loading>((set) => ({
  loadingOpen: false,
  setLoadingOpen: (loadingOpen: boolean) => {
    set({ loadingOpen })
  }
}))

type UserData = {
  uid: number | string
  outtime: number
}
type UseUserType = {
  userData: UserData
  setUserData: (userData: UserData) => void
  removeUserData: () => void
}
/**
 * @description: 登录数据处理
 * @param {type} create
 * @return {type}
 * @example:
 * const { userData, setUserData, removeUserData } = useUserStore()
 */
export const useUserStore = create<UseUserType>((set) => {
  const initialValue: UserData = {
    uid: '',
    outtime: 0
  }
  return {
    userData: getStorage(`UserData`) || initialValue,
    setUserData: (userData: UserData) => {
      set({ userData })
      const outtime: number = userData.outtime
      if (outtime > 0) {
        setStorage(`UserData`, userData, { expire: outtime })
      } else {
        setStorage(`UserData`, userData)
      }
    },
    removeUserData: () => {
      set({ userData: initialValue })
      removeStorage(`UserData`)
    }
  }
})

type PageTitle = {
  pageTitle: string
  setPageTitle: (pageTitle: string) => void
}
/**
 * @description: 页面Title
 * @param {type} create
 * @return {type}
 * @example:
 * const { pageTitle, setPageTitle } = usePageTitle()
 * --HTML--
 * <div>{pageTitle}</div>
 * <button onClick={() => setPageTitle('页面标题')}>设置标题</button>
 */
export const usePageTitle = create<PageTitle>((set) => ({
  pageTitle: '页面标题',
  setPageTitle: (pageTitle: string) => {
    set({ pageTitle })
  }
}))
