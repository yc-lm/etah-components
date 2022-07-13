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

/**
 * 处理尺寸
 * @param dimension    传入的尺寸，如 width、height等
 * @param defaultValue 默认值
 */
export function dealDimension(dimension, defaultValue = "auto") {
    if (isNull(dimension) || isUndefined(dimension)) return defaultValue;

    const tempStr = String(dimension);
    if (tempStr.includes("px") || tempStr.includes("%")) {
        return tempStr;
    } else {
        return tempStr + "px";
    }
}
