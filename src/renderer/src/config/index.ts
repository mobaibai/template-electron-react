/**
 * @description: 项目名
 * @return {type}
 */
export const APP_NAME: string = 'ElectronReact'

/**
 * @description: 主题色
 * @return {type}
 */
export const ThemePrimary: string = '#13c2c2'

interface BaseConfigType {
  API_URL: String
}
/**
 * @description: 生产地址
 * @return {type}
 */
export const Config: BaseConfigType = {
  API_URL: `https://www.dongchedi.com` // 懂车帝基本地址
}
