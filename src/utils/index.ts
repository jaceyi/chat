/**
 * @description emoji 转 图片地址
 * @param unicode
 */
export const getEmojiSrc = (unicode: string): string => {
  if (!twemoji) return '';
  const { convert, base, size, ext } = twemoji;
  const codePoint = convert.toCodePoint(unicode);
  return `${base}${size}/${codePoint}${ext}`;
};

/**
 * @description 连接器 一般适用于连接外部传递参数和事件参数
 * @param func
 * @returns {function(...[*]): function(...[*]=)}
 */

interface ConnectorCallback<P = any[], V = any[]> {
  ([...P], [...V]): void;
}

export const connector = <P extends any[], V extends any[]>(
  func: ConnectorCallback<P, V>
) => {
  return (...params: P) => (
    ...eventValues: any[]
  ): void | ConnectorCallback<P, V> => {
    func && func([...params], [...eventValues]);
  };
};

export const compose = <T = any>(...functions: Function[]) => (arg: any): T => {
  return functions.reduce((val, f) => f(val), arg);
};

/**
 * @description 生成一个数字英文随机组成的字符串
 * @returns {string}
 */
export const getRandomId = (): string => {
  return new Date().getTime() + Math.random().toString(36).substr(2);
};

/**
 * @description 是否为空
 */
export const isEmpty = (object: object): boolean => {
  if (!object) return true;
  return Object.keys(object).length === 0;
};
