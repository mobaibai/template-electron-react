/**
 * @description: 时间转换
 * @param {number} time
 * @param {string} format
 * @return {type}
 */
export const formatTime = (time: number | string | Date, format: string): string => {
  const date = time ? new Date(time) : new Date()
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  const ms = date.getMilliseconds().toString().padStart(3, '0')

  const formattedTime = format
    .replace(/yyyy/g, year.toString())
    .replace(/MM/g, month)
    .replace(/dd/g, day)
    .replace(/HH/g, hours)
    .replace(/mm/g, minutes)
    .replace(/ss/g, seconds)
    .replace(/fff/g, ms)

  return formattedTime
}