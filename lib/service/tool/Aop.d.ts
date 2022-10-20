/**
 * 增加 静态属性 方便对对象进行缓存
 * @param key
 * @constructor
 */
export declare function CacheKey(key: string): (target: any) => void;
/**
 * 对方法进行标记
 * @param key
 * @constructor
 */
export declare function EnableProxy(): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
/**
 * 对方法进行标记,打印LOG
 * @param key
 * @constructor
 */
export declare function EnableLogs(): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
