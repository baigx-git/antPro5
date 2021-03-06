import {parse} from 'querystring';
import {getLocale} from "@@/plugin-locale/localeExports";
import {
  zhCNIntl,
  enUSIntl,
  viVNIntl,
  itITIntl,
  jaJPIntl,
  esESIntl,
  ruRUIntl,
  msMYIntl,
  zhTWIntl,
  frFRIntl,
  ptBRIntl,
} from '@ant-design/pro-table';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const {NODE_ENV} = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => {
  const {href} = window.location;
  const qsIndex = href.indexOf('?');
  const sharpIndex = href.indexOf('#');

  if (qsIndex !== -1) {
    if (qsIndex > sharpIndex) {
      return parse(href.split('?')[1]);
    }

    return parse(href.slice(qsIndex + 1, sharpIndex));
  }

  return {};
};

/**
 * 数组转对象属性(code和name)
 */
export const changeObj = (obj: any[]) => {
  if (!obj.length) {
    return {}
  }
  const params: any[] = [];
  obj.forEach((item: any) => {
    let param = {}
    param.text = item.name
    param.status = item.code
    params.push(param)
  })
  return Object.fromEntries(params.map(item => [item.status, item]))
}

/**
 * 获取国际化
 */

export const intlMap = {
  zhCNIntl,
  enUSIntl,
  viVNIntl,
  itITIntl,
  jaJPIntl,
  esESIntl,
  ruRUIntl,
  msMYIntl,
  zhTWIntl,
  frFRIntl,
  ptBRIntl,
};

export const localLang = () => {
  const selectedLang = getLocale();
  console.log(selectedLang)
  if (selectedLang === 'zh-CN') {
    return 'zhCNIntl'
  }
  if (selectedLang === 'en-US') {
    return 'enUSIntl'
  }
  if (selectedLang === 'zh-TW') {
    return 'zhTWIntl'
  }
  return 'zhCNIntl';
}
