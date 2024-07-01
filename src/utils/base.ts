import {_global} from "../utils";
import {Callback, ErrorTypeEnum, IAnyObject} from "../types";

// 获取当前时间
export const getTimestamp = (): number => {
    return new Date().getTime()
}

// 记录最后一次的路由
export const localStorageRouter = "_king_web_eye_router_";
// 保存用户的UUID
export const localStorageUUID = "_king_web_eye_uuid_";
// 分割
const splitStr = "|||";

// 设置缓存数据
export function setCacheData(key: string, value: string, time = getTimestamp()): void{
    const data = `${value}${splitStr}${time}`;
    _global.localStorage.setItem(key, data);
}

// 获取缓存数据
export function getCacheData(key: string): {value: string | null, time: number} {
    const data = _global.localStorage.getItem(key);
    if(data && data.indexOf(splitStr) > -1){
        const [value, time] = data.split(splitStr);
        return {value, time: Number(time)};
    }

    return {value: data, time: 0};
}


/**
 * 监听页面加载完成
 * @param {Callback} callback
 */
export const afterLoad = (callback: Callback): void => {
    if (document.readyState === 'complete') {
        callback();
    } else {
        window.addEventListener('pageshow', callback, { once: true, capture: true });
    }
};

/**
 * GET请求地址获取参数
 * */
export const getDomainFromUrl = (url: string): IAnyObject => {
    const str = "/x?a=1&b=2";

    const domain = new URL(url);

    console.info("===get url===", domain);

    return {};
}

/**
 * 获取域名相关数据
 * */
export const getDomainUrl = (url: string): URL => {
    return new URL(url, window.location.origin); // 使用 window.location.origin 处理相对URL
}

/**
 * 获取查询参数
 * */
export const getQueryParams = (url: string): { [key: string]: string } => {
    const params: { [key: string]: string } = {};
    const parsedUrl = getDomainUrl(url);
    parsedUrl.searchParams.forEach((value, key) => {
        params[key] = value;
    });
    return params;
}

/**
 * 解析 URL 编码的请求体
 * */
export const parseUrlEncodedBody = (body: string): { [key: string]: string } => {
    const params = new URLSearchParams(body);
    const parsedBody: { [key: string]: string } = {};
    params.forEach((value, key) => {
        parsedBody[key] = value;
    });
    return parsedBody;
}

/**
 * 请求 Headers Key 驼峰写法
 * */
export const formatHeadersKey = (headersKey: string): string => {
    return headersKey.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join('-');
}


/**
 * 生成 UUID
 * */
export const getUuid = (): string => {
    let timestamp = new Date().getTime();
    let perforNow = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let random = Math.random() * 16;
        if (timestamp > 0) {
            random = (timestamp + random) % 16 | 0;
            timestamp = Math.floor(timestamp / 16);
        } else {
            random = (perforNow + random) % 16 | 0;
            perforNow = Math.floor(perforNow / 16);
        }
        return (c === 'x' ? random : (random & 0x3) | 0x8).toString(16);
    });
}

/**
 * 判断是js异常、静态资源异常还是跨域异常
 * @param {(ErrorEvent | Event)} event
 * @return {*}
 */
export const getErrorType = (event: ErrorEvent | Event) => {
    const isJsError = event instanceof ErrorEvent;
    if (!isJsError) return ErrorTypeEnum.SR;
    return event.message === 'Script error.' ? ErrorTypeEnum.CS : ErrorTypeEnum.JS;
};
