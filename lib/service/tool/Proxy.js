"use strict";
// ERROR 栈
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProxy = exports.errorHandlerController = exports.registerTransactionErrorHandler = exports.ErrorInfo = void 0;
const Tool_1 = require("../../Tool");
const BasicException_1 = require("../../BasicException");
class ErrorInfo {
}
exports.ErrorInfo = ErrorInfo;
let availableErrorHandler = (error) => {
    Tool_1.Trace.error('availableErrorHandler', error);
};
/**
 * 注册 交易异常处理回调
 * @param errorHandler
 */
function registerTransactionErrorHandler(errorHandler) {
    availableErrorHandler = errorHandler;
}
exports.registerTransactionErrorHandler = registerTransactionErrorHandler;
/**
 * 异常处理控制器
 * @param e
 * @param method
 * @param args
 * @param target
 */
function errorHandlerController(e, method, args, target) {
    try {
        const errorInfo = new ErrorInfo();
        errorInfo.error = e;
        errorInfo.method = method;
        try {
            errorInfo.args = JSON.stringify(args);
        }
        catch (e) {
            errorInfo.args = args;
        }
        errorInfo.target = target;
        if (e instanceof BasicException_1.BasicException) {
            errorInfo.msg = e.msg;
        }
        else {
            errorInfo.msg = e.toString();
        }
        availableErrorHandler(errorInfo);
    }
    catch (e) {
        Tool_1.Trace.error(e);
    }
}
exports.errorHandlerController = errorHandlerController;
/**
 * 对象代理
 * @param obj
 */
function createProxy(obj) {
    return new Proxy(obj, {
        get(target, propKey) {
            const ins = target[propKey];
            // const typeStr = Object.prototype.toString.call(target[propKey]);
            // if (typeStr === '[object AsyncFunction]' || typeStr === '[object Function]')
            // 使用注解设置数据
            if (ins.proxyEnable || ins.logEnable) {
                // tslint:disable-next-line:only-arrow-functions
                return function () {
                    const args = arguments;
                    // 不能使用箭头函数，获取到的 arguments 不是请求的
                    try {
                        const res = ins.apply(target, args);
                        if (res instanceof Promise) {
                            return new Promise((resolve, reject) => {
                                res
                                    .then((data) => {
                                    if (ins.logEnable) {
                                        Tool_1.Trace.debug(`${target.constructor.CACHE_KEY}.${propKey} `, 'args=', args, 'result', data);
                                    }
                                    resolve(data);
                                })
                                    .catch((err) => {
                                    if (ins.proxyEnable) {
                                        errorHandlerController(err, propKey, args, target);
                                    }
                                    if (ins.logEnable) {
                                        errorHandlerController(err, propKey, args, target);
                                        Tool_1.Trace.debug(`${target.constructor.CACHE_KEY}.${propKey}`, 'args=', args, 'error', err);
                                    }
                                    reject(err);
                                });
                            });
                        }
                        else {
                            if (ins.logEnable) {
                                Tool_1.Trace.debug(`${target.constructor.CACHE_KEY}.${propKey}`, 'args=', args, 'result', res);
                            }
                            return res;
                        }
                    }
                    catch (err) {
                        if (ins.proxyEnable) {
                            errorHandlerController(err, propKey, args, target);
                        }
                        if (ins.logEnable) {
                            errorHandlerController(err, propKey, args, target);
                            Tool_1.Trace.debug(`${target.constructor.CACHE_KEY}.${propKey}`, 'args=', args, 'error', err);
                        }
                        throw err;
                    }
                };
            }
            else {
                // 非方法对象，直接返回
                return ins;
            }
        },
    });
}
exports.createProxy = createProxy;
