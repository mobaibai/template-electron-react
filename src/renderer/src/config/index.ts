/**
 * @description: 项目名
 * @return {type}
 */
export const APP_NAME: string = 'ElectronReact'

/**
 * @description: 主题色
 * @return {type}
 */
export const ThemePrimary: string = '#f5222d'

interface BaseConfigType {
  API_URL: String
  API_BASE_URL: string
  API_GET_URL: String
  API_POST_URL: String
}
/**
 * @description: 生产地址
 * @return {type}
 */
export const Config: BaseConfigType = {
  API_URL: `https://wy.d5.world`, // 基本地址
  API_BASE_URL: `https://www.dongchedi.com`, // 懂车帝基本地址
  API_GET_URL: `https://wy.d5.world/car/Manager/get_proxy`,
  API_POST_URL: `https://wy.d5.world/car/Manager/post_proxy`
}
