const dev = 'www.dongchedi.com'
const prod = 'www.dongchedi.com'
const protocol = window.location.protocol

interface BaseApiType {
  API_BASE_URL: string
}

/**
 * @description: 开发
 * @return {type}
 */
const development: BaseApiType = {
  API_BASE_URL: `${protocol}//${dev}`, // 基本地址
}

/**
 * @description: 生产
 * @return {type}
 */
const production: BaseApiType = {
  API_BASE_URL: `${protocol}//${prod}`,
}

/**
 * @description: 请求地址前缀
 * @return {type}
 */
export const BaseApi: BaseApiType = __isDev__ ? development : production

/**
 * @description: 项目名
 * @return {type}
 */
export const APP_NAME = 'APP_NAME'

/**
 * @description: 主题色
 */
export const ThemePrimary = '#13c2c2'
