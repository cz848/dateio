/**
 * 统一处理日期或格式化输出
 * Author: Tyler.Chao
 * github: https://github.com/cz848/dateio#get
 */

/* eslint-disable no-param-reassign */
class DateIO {
  // 转换为可识别的日期格式
  constructor(input) {
    if ([null, undefined].indexOf(input) > -1) input = Date.now();
    else if (typeof input === 'string' && !/T.+(?:Z$)?/i.test(input)) input = input.replace(/-/g, '/');
    else if (Array.isArray(input)) input = new Date(input.splice(0, 3)).setHours(...input.concat(0));
    this.$date = new Date(input);
  }

  // 获取不同格式的日期，每个unit对应一种格式
  get(unit) {
    if (!unit) return;
    const date = this.$date;
    let value;
    if (/^[wu]$/i.test(unit)) {
      value = {
        w: date.getDay(),
        W: '日一二三四五六'[date.getDay()],
        u: +date,
        U: Math.round(date / 1000),
      }[unit];
    } else {
      // 转换成中国时区并输出'2019-10-10T15:10:22:123Z'的形式，再解析出所需要的数值
      value = new Date(+date - date.getTimezoneOffset() * 6e4).toISOString()
        .replace(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z$/i,
          (...arg) => arg['_YMDHISMS'.search(unit.toUpperCase())] || '');
    }
    if (/^(?:ms|[ymdhis])$/.test(unit)) value -= 0;
    return value || value === 0 ? value : undefined;
  }

  // 利用格式化串格式化日期
  format(formats) {
    return String(formats || 'Y-M-D H:I:S').replace(/MS|ms|[YMDWHISUymdwhisu]/g, unit => this.get(unit));
  }

  toString() {
    return this.$date.toString();
  }

  valueOf() {
    return +this.$date;
  }
}

const dateio = input => new DateIO(input);

dateio.prototype = DateIO.prototype;
// 用Unix秒时间戳设置时间
dateio.U = input => dateio(input * 1e3);

export default dateio;
