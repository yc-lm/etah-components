/**
 * 判断值未定义
 * @param value
 * @return {boolean}
 */
export function isUndefined(value) {
    return Object.prototype.toString.call(value) === "[object Undefined]";
}

/**
 * 判断值是否是null
 * @param value
 * @returns {boolean}
 */
export function isNull(value) {
    return Object.prototype.toString.call(value) === "[object Null]";
}
