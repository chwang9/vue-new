import { parse } from "querystring";

/* eslint-disable */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
/* eslint-disable */

export const isUrl = path => reg.test(path);

export const getPageQuery = () => parse(window.location.href.split("?")[1]);
