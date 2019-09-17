/**
 * @author xjq <416474849@qq.com>
 */

/**
 * 纠正数据，并以字符串形式输出，使得超出最大安全数（15位）的数据可以显示
 * @param {number} num 需要纠正的数据
 * @param {number} precision 精确到小数点后面第几位
 * @return {string} 纠正后的数字字符串
 * @example strip(0.09999999999999998)=0.1
 */
export function strip(num, precision = 12) {
  return +parseFloat(num.toPrecision(precision))
}

/**
 * 返回小数点后面的数字位数
 * @param {number} num 需要判断的数字
 * @return {number} 小数点后面位数
 * @example
 *  digitLength(0.1) => 1
 *  digitLength(0.12) => 2
 *  digitLength(123.12) => 2
 */
export function digitLength(num) {
  const eSplit = num.toString().split(/[eE]/)// Get digit length of e
  const len = (eSplit[0].split('.')[1] || '').length - (+(eSplit[1] || 0))
  return len > 0 ? len : 0
}

/**
 * 把小数转成整数，支持科学计数法。如果是小数则放大成整数
 * @param {number} num 需要转换的小数
 * @return {number|String} 转换后的整数
 * @example
 *  float2Fixed(1.23) => 123
 */
export function float2Fixed(num) {
  if (num.toString().indexOf('e') === -1) {
    return Number(num.toString().replace('.', ''))
  }
  const dLen = digitLength(num)
  return dLen > 0 ? strip(num * Math.pow(10, dLen)) : num
}

/**
* 检测数字是否越界，如果越界给出提示
* @param {number} num 需要检测的数字
* @return {boolean} true数组越界，没越界false
*/
export function checkBoundary(num) {
  if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
    console.warn(`${num} 超出数字安全范围(${Number.MAX_SAFE_INTEGER},${Number.MIN_SAFE_INTEGER}),计算结果可能不准确`)
    return true
  } else {
    return false
  }
}

/**
 * 精确乘法,支持多个数字相乘不仅仅只支持两个数字
 * @param {number | string} num1 需要相乘的数字或数字字符串
 * @param {number | string} others 其它需要相乘的数字
 * @return {number}
 * @example
 *  mul(2,2) => 4
 *  mul(2,2,2) => 8
 */
export function mul(num1, num2, ...others) {
  if (others.length > 0) {
    return mul(mul(num1, num2), others[0], ...others.slice(1))
  }
  const num1Changed = float2Fixed(num1)
  const num2Changed = float2Fixed(num2)
  const baseNum = digitLength(num1) + digitLength(num2)
  const leftValue = num1Changed * num2Changed

  checkBoundary(leftValue)

  return leftValue / Math.pow(10, baseNum)
}

/**
 * 精确加法,支持多个数字相加不仅仅只支持两个数字
 * @param {number | string} num1 需要相加的数字或数字字符串
 * @param {number | string} others 其它需要相加的数字
 * @return {number}
 * @example
 *  add(2,2) => 4
 *  add(2,2,2) => 6
 */
export function add(num1, num2, ...others) {
  if (others.length > 0) {
    return add(add(num1, num2), others[0], ...others.slice(1))
  }
  const baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)))
  return (mul(num1, baseNum) + mul(num2, baseNum)) / baseNum
}

/**
 * 精确减法,支持多个数字相减不仅仅只支持两个数字
 * @param {number | string} num1 需要相减的数字或数字字符串
 * @param {number | string} others 其它需要相减的数字
 * @return {number}
 * @example
 *  sub(2,2) =>0
 *  sub(2,2,2) => -2
 */
export function sub(num1, num2, ...others) {
  if (others.length > 0) {
    return sub(sub(num1, num2), others[0], ...others.slice(1))
  }
  const baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)))
  return (mul(num1, baseNum) - mul(num2, baseNum)) / baseNum
}

/**
 * 精确除法,支持多个数字相除不仅仅只支持两个数字
 * @param {number | string} num1 需要相除的数字或数字字符串
 * @param {number | string} others 其它需要相除的数字
 * @return {number}
 * @example
 *  div(2,2) =>1
 *  div(2,2,2) => 0.5
 */
export function div(num1, num2, ...others) {
  if (others.length > 0) {
    return div(div(num1, num2), others[0], ...others.slice(1))
  }
  const num1Changed = float2Fixed(num1)
  const num2Changed = float2Fixed(num2)
  checkBoundary(num1Changed)
  checkBoundary(num2Changed)
  return mul((num1Changed / num2Changed), Math.pow(10, digitLength(num2) - digitLength(num1)))
}

/**
 * 四舍五入
 * @param {number | string} 需要四舍五入的数字或数字字符串
 * @param {number | string} 四舍五入到小数点第几位
 * @return {number} 四舍五入后的数字
 * @example
 *  round('2.1235','3') => 2.124
 *  round(2.1235,2) => 2.12
 */
export function round(num, ratio) {
  const base = Math.pow(10, ratio)
  return div(Math.round(mul(num, base)), base)
}

