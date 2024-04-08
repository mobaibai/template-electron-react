import { create } from 'zustand'
import { getStorage, removeStorage, setStorage } from '@renderer/storage'

interface Loading {
  loadingOpen: boolean
  setLoadingOpen: (loadingOpen: boolean) => void
}
/**
 * @description: 设置Loading
 * @param {type} create
 * @return {type}
 */
export const useLoadingStore = create<Loading>((set) => ({
  loadingOpen: false,
  setLoadingOpen: (loadingOpen: boolean) => {
    set({ loadingOpen })
  }
}))

interface UserData {
  uid: number | string
  outtime: number
}
interface UseUserType {
  userData: UserData
  setUserData: (userData: UserData) => void
  removeUserData: () => void
}
/**
 * @description: 登录数据处理
 * @param {type} create
 * @return {type}
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

interface ShowConf {
  header?: boolean
  listBg?: boolean
}
interface IsShow {
  showConf: ShowConf
  setIsShow: (showConf: ShowConf) => void
}
/**
 * @description: 页面显示配置
 */
export const useIsShowStore = create<IsShow>((set) => ({
  showConf: { header: false, listBg: false },
  setIsShow: (showConf: ShowConf) => {
    set({ showConf })
  }
}))