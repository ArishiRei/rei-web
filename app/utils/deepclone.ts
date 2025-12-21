// 🌟 通用深度拷贝 deepClone
export function deepClone<T>(value: T, cache = new WeakMap()): T {
  // 基本类型 & function
  if (value === null || typeof value !== "object") {
    return value;
  }

  // 循环引用处理
  if (cache.has(value)) {
    return cache.get(value);
  }

  // 日期
  if (value instanceof Date) {
    return new Date(value.getTime()) as any;
  }

  // 正则
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as any;
  }

  // Map
  if (value instanceof Map) {
    const result = new Map();
    cache.set(value, result);

    value.forEach((v, k) => {
      result.set(deepClone(k, cache), deepClone(v, cache));
    });

    return result as any;
  }

  // Set
  if (value instanceof Set) {
    const result = new Set();
    cache.set(value, result);

    value.forEach(v => {
      result.add(deepClone(v, cache));
    });

    return result as any;
  }

  // 数组
  if (Array.isArray(value)) {
    const result: any[] = [];
    cache.set(value, result);

    value.forEach((v, i) => {
      result[i] = deepClone(v, cache);
    });

    return result as any;
  }

  // 普通对象（保留原型）
  const result = Object.create(Object.getPrototypeOf(value));
  cache.set(value, result);

  for (const key of Reflect.ownKeys(value)) {
    // @ts-ignore
    result[key] = deepClone((value as any)[key], cache);
  }

  return result as T;
}



// export interface DeepCloneOptions {
//   /** 忽略字段 */
//   ignoreKeys?: (string | symbol)[];
//   /** 是否克隆原型链（默认 true） */
//   clonePrototype?: boolean;
// }

// export function utilDeepClone<T>(
//   value: T,
//   cache = new WeakMap(),
//   options: DeepCloneOptions = {},
// ): T {

//   const { ignoreKeys = [], clonePrototype = true } = options;

//   // 基础类型直接返回
//   if (value === null || typeof value !== "object") return value;

//   // 循环引用
//   if (cache.has(value)) return cache.get(value);

//   // =========== 支持内建对象 ===========
//   if (value instanceof Date) return new Date(value.getTime()) as any;
//   if (value instanceof RegExp) return new RegExp(value.source, value.flags) as any;

//   // =========== Map ===========
//   if (value instanceof Map) {
//     const result = new Map();
//     cache.set(value, result);
//     value.forEach((v, k) => result.set(
//       utilDeepClone(k, cache, options),
//       utilDeepClone(v, cache, options),
//     ));
//     return result as any;
//   }

//   // =========== Set ===========
//   if (value instanceof Set) {
//     const result = new Set();
//     cache.set(value, result);
//     value.forEach(v => result.add(utilDeepClone(v, cache, options)));
//     return result as any;
//   }

//   // =========== Class Instance ===========
//   const isPlainObject =
//     Object.getPrototypeOf(value) === Object.prototype ||
//     Object.getPrototypeOf(value) === null;

//   let result: any;

//   if (!isPlainObject) {
//     // 非普通对象 → class instance
//     result = clonePrototype
//       ? Object.create(Object.getPrototypeOf(value))
//       : {};
//   } else {
//     // 普通对象
//     result = {};
//   }

//   cache.set(value, result);

//   // 遍历全部 key（含 symbol）
//   for (const key of Reflect.ownKeys(value)) {
//     if (ignoreKeys.includes(key)) continue; // 忽略字段

//     const val = (value as any)[key];
//     result[key] = utilDeepClone(val, cache, options);
//   }

//   return result as T;
// }


/*
DEMO: 


class User {
  constructor(public name: string, public age: number) {}
  sayHi() {
    return "Hi " + this.name;
  }
}

const u = new User("Rei", 18);
(u as any)._token = "SECRET";

const cloned = deepClone(u, new WeakMap(), {
  ignoreKeys: ["_token"], // 忽略敏感字段
});

console.log(cloned instanceof User); // true
console.log(cloned.sayHi()); // "Hi Rei"

*/