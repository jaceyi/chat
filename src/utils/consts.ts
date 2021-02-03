// 校验网址的正则
const internetStrRegex =
  '((https|http|ftp|rtsp|mms)?://)(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-z_!~*()-]+.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].[a-z]{2,6})(:[0-9]{1,4})?((/?)|(/[0-9a-z_!~*().;?:@&=+$,%#-]+)+/?)';
export const REGEX_INTERNET = new RegExp(internetStrRegex, 'g');

export const REGEX_EMOJI = /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]/gi;
