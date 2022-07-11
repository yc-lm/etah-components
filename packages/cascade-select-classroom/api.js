import axios from "axios";
import { isNull, isUndefined } from "./utils";

// 超时时间
const REQUEST_TIMEOUT = 10 * 1000;
// 类型
export const CONTENT_TYPE_JSON = "application/json";
// get 请求
export const REQUEST_GET = "get";
// 成功标识
export const OK = "OK";

// 创建实例
const myRequest = axios.create({
    timeout: REQUEST_TIMEOUT, // 超时时间
});

// 请求拦截
myRequest.interceptors.request.use(
    (config) => {
        if (config.headers) {
            // Content-type 默认为 application/json
            const tempType = config.headers["Content-Type"];
            config.headers["Content-Type"] = tempType
                ? tempType
                : CONTENT_TYPE_JSON;
        }

        // 添加时间戳
        if (config.method) {
            const tempMethod = config.method.toLowerCase();
            if (tempMethod === "get") {
                config.params = {
                    ...config.params,
                    _t: Date.parse(String(new Date())) / 1000,
                };
            }
        }

        return config;
    },
    (error) => {
        console.log(error);
        return Promise.reject(error);
    }
);

// 响应拦截
myRequest.interceptors.response.use(
    (response) => {
        if (response.status === 200) {
            // 统一返回数据
            return {
                error: response.data.error,
                value: response.data.value,
                msg:
                    response.data.msg || response.data.data
                        ? response.data.msg || response.data.data
                        : response.data.value,
            };
        } else {
            return false;
        }
    },
    (error) => {
        console.log("err" + error);
        return Promise.reject(error);
    }
);

/**
 * 获取教育区列表
 * @param url      请求路径
 * @param devType  设备类型
 * @param data     请求参数
 * @return Object {AxiosPromise}
 */
export function getDistList({ url, devType, data }) {
    return myRequest({
        url: url + `/bmd/dev-${devType}.php`,
        method: REQUEST_GET,
        params: {
            api: "get-dist-list",
            ...data,
        },
    });
}

/**
 * 获取学校列表
 * @param url      请求路径
 * @param devType  设备类型
 * @param data     请求参数
 * @return Object {AxiosPromise}
 */
export function getSchoolList({ url, devType, data }) {
    return myRequest({
        url: url + `/bmd/dev-${devType}.php`,
        method: REQUEST_GET,
        params: {
            api: "get-school-list",
            ...data,
        },
    });
}

/**
 * 获取校区列表
 * @param url      请求路径
 * @param devType  设备类型
 * @param data     请求参数
 * @return Object {AxiosPromise}
 */
export function getAreaList({ url, devType, data }) {
    return myRequest({
        url: url + `/bmd/dev-${devType}.php`,
        method: REQUEST_GET,
        params: {
            api: "get-area-list",
            ...data,
        },
    });
}

/**
 * 获取学区的教学楼列表
 * @param url      请求路径
 * @param devType  设备类型
 * @param data     请求参数
 * @return Object {AxiosPromise}
 */
export function getBuildList({ url, devType, data }) {
    return myRequest({
        url: url + `/bmd/dev-${devType}.php`,
        method: REQUEST_GET,
        params: {
            api: "get-build-list",
            ...data,
        },
    });
}

/**
 * 获取楼栋的教室列表
 * @param url      请求路径
 * @param devType  设备类型
 * @param data     请求参数
 * @return Object {AxiosPromise}
 */
export function getRoomList({ url, devType, data }) {
    return myRequest({
        url: url + `/bmd/dev-${devType}.php`,
        method: REQUEST_GET,
        params: {
            api: "get-room-list",
            ...data,
        },
    });
}

/**
 * 处理接口返回的数据
 * @param {Function} api       接口方法，必传
 * @param {Object} [params]    接口入参，可选
 * @param {*} [defaultValue]   出错时的默认出参，可选
 * @return {Promise<any>} 传入默认值，则出错时，resolve 默认值；不传，则出错时，reject 错误数据，需要 catch 处理
 */
export function apiSimpleWrapper({ api, params, defaultValue }) {
    return new Promise((resolve, reject) => {
        api(params)
            .then(({ error, value, msg }) => {
                if (error === OK && !isUndefined(value) && !isNull(value)) {
                    resolve(value);
                } else {
                    if (isUndefined(defaultValue)) {
                        reject(msg);
                    } else {
                        resolve(defaultValue);
                    }
                }
            })
            .catch((error) => {
                if (isUndefined(defaultValue)) {
                    reject(error);
                } else {
                    resolve(defaultValue);
                }
            });
    });
}
