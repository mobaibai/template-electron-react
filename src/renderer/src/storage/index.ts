import CryptoJS from 'crypto-js'
import { APP_NAME } from '@renderer/config'

// 十六位十六进制数作为密钥
const SECRET_KEY = CryptoJS.enc.Utf8.parse('3333e6e143439161')
// 十六位十六进制数作为密钥偏移量
const SECRET_IV = CryptoJS.enc.Utf8.parse('e3bbe7e3ba84431a')

// 类型 window.localStorage, window.sessionStorage,
interface ConfigType {
  type?: 'localStorage' | 'sessionStorage'
  prefix?: string | undefined
  expire?: number
  isEncrypt?: boolean
}
const config: ConfigType = {
  type: 'localStorage', // 本地默认存储类型 localStorage
  prefix: APP_NAME, // 名称前缀: 项目名 + 版本
  expire: 0, // 过期时间 单位：秒
  isEncrypt: false // 默认加密 可设置开发环境与生产环境
  // isEncrypt: !isDev // 默认加密 可设置开发环境与生产环境
}

/**
 * @description: 判断是否支持 Storage
 * @return {type}
 */
export function isSupportStorage() {
  return typeof Storage !== 'undefined'
}

/**
 * @description: 设置 setStorage
 * @param {string} key
 * @param {T} value 值
 * @param {type} expire 过期时间(秒)
 * @param {type} type 类型
 * @return {type}
 */
export function setStorage<T>(
  key: string,
  value: T | null,
  { expire = 0, type = 'localStorage' }: ConfigType = {}
) {
  if (value === '' || value === null || value === undefined) {
    value = null
  }

  if (isNaN(expire) || expire < 0) throw new Error('Expire must be a number')

  const data = {
    value, // 存储值
    time: Date.now() / 1000, // 存值时间戳
    expire // 过期时间
  }

  const encryptString = config.isEncrypt ? encrypt(JSON.stringify(data)) : JSON.stringify(data)

  window[type].setItem(autoAddPrefix(key), encryptString)
}

/**
 * @description: 获取 getStorage
 * @param {string} key
 * @param {type} type 存储类型
 * @return {type}
 */
export function getStorage(key: string, { type = 'localStorage' }: ConfigType = {}) {
  key = autoAddPrefix(key)
  // key 不存在判断
  if (!window[type].getItem(key) || JSON.stringify(window[type].getItem(key)) === 'null') {
    return null
  }

  // 优化 持续使用中续期
  const item = window[type].getItem(key)
  const storage: Storage = config.isEncrypt
    ? JSON.parse(decrypt(item ?? ''))
    : JSON.parse(item ?? '')

  const nowTime = Date.now() / 1000

  // 过期删除
  if (storage.expire && storage.expire < nowTime) {
    removeStorage(key)
    return null
  } else {
    // 未过期期间被调用 则自动续期 进行保活
    setStorage(autoRemovePrefix(key), storage.value, { expire: storage.expire })
    return storage.value
  }
}

/**
 * @description: 删除 removeStorage
 * @param {string} key
 * @param {type} type 存储类型
 * @return {type}
 */
export function removeStorage(key: string, { type = 'localStorage' }: ConfigType = {}) {
  window[type].removeItem(autoAddPrefix(key))
}

/**
 * @description: 根据索引获取key
 * @param {number} index
 * @param {type} type 存储类型
 * @return {type}
 */
export function getStorageForIndex(index: number, { type = 'localStorage' }: ConfigType = {}) {
  return window[type].key(index)
}

/**
 * @description: 获取localStorage长度
 * @param {type} type 存储类型
 * @return {type}
 */
export function getStorageLength({ type = 'localStorage' }: ConfigType = {}) {
  return window[type].length
}

/**
 * @description: 清空 clearStorage
 * @param {type} type 存储类型
 * @return {type}
 */
export function clearStorage({ type = 'localStorage' }: ConfigType = {}) {
  window[type].clear()
}

/**
 * @description: 名称前自动添加前缀
 * @param {string} key
 * @return {type}
 */
function autoAddPrefix(key: string) {
  const prefix = config.prefix ? `${config.prefix}_` : ''
  return prefix + key
}

/**
 * @description: 移除已添加的前缀
 * @param {string} key
 * @return {type}
 */
function autoRemovePrefix(key: string) {
  const len: number = config.prefix ? config.prefix.length + 1 : 0
  // return key.substr(len) 已弃用
  return key.substring(len)
}

/**
 * @description: 加密
 * @param {string} data
 * @return {*}
 */
function encrypt(data: string) {
  if (typeof data === 'object') {
    try {
      data = JSON.stringify(data)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('encrypt error:', error)
    }
  }
  const dataHex = CryptoJS.enc.Utf8.parse(data)
  const encrypted = CryptoJS.AES.encrypt(dataHex, SECRET_KEY, {
    iv: SECRET_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.ciphertext.toString()
}

/**
 * @description: 解密
 * @param {string} data
 * @return {*}
 */
function decrypt(data: string) {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(data)
  const str = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  const decrypt = CryptoJS.AES.decrypt(str, SECRET_KEY, {
    iv: SECRET_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}
