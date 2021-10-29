import type { MouseEvent } from 'react';

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

export const compose = <T = any>(...functions: Function[]) => {
  return (arg: any): T => {
    return functions.reduce((val, f) => f(val), arg);
  };
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
export const isEmpty = (object: any): boolean => {
  if (!object) return true;
  return Object.keys(object).length === 0;
};

/**
 * @description 阻止事件冒泡
 * @param e
 */
export const stopPropagation = <T = HTMLDivElement>(e: MouseEvent<T>) =>
  e.stopPropagation();

/**
 * @description 防抖
 * @param func
 * @param wait
 */
export const debounce = <T extends any[]>(func: Function, wait: number) => {
  let timer: number;
  return (...args: T) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      func(...args);
    }, wait);
  };
};
