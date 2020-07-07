/**
 * 统一处理日期或格式化输出
 * Author: Tyler.Chao
 * github: https://github.com/cz848/dateio#get
 */

// 转换为可识别的日期格式
const toDate = input => {
  if (!(input || input === 0)) return new Date();
  if (typeof input === 'string' && !/Z$/i.test(input)) return new Date(input.replace(/-/g, '/'));
  // TODO: 与原生行为有出入
  if (Array.isArray(input) && input.length !== 1) return new Date(...input);
  return new Date(input);
};

class DateIO {
  constructor(input) {
    this.$date = toDate(input);
  }

  // 获取不同格式的日期，每个unit对应一种格式
  get(unit) {
    if (!unit) return;
    const d = this.$date;
    let res;
    if (/^[wu]$/i.test(unit)) {
      res = {
        w: d.getDay(),
        W: '日一二三四五六'[d.getDay()],
        u: +d,
        U: Math.round(d / 1000),
      }[unit];
    } else {
      // 转换成中国时区并输出'2019-10-10T15:10:22:123Z'的形式，再解析出所需要的数值
      res = new Date(+d - d.getTimezoneOffset() * 6e4).toISOString()
        .replace(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z+$/i,
          (...arg) => arg['_YMDHISMS'.search(unit.toUpperCase())] || '');
    }
    if (/^(?:ms|[ymdhis])$/.test(unit)) res = Number(res);
    return res || undefined;
  }

  toString() {
    return this.$date.toString();
  }

  valueOf() {
    return this.$date.valueOf();
  }

  // 利用格式化串格式化日期
  format(formats) {
    return String(formats || 'Y-M-D H:I:S').replace(/MS|ms|[YMDWHISUymdwhisu]/g, unit => this.get(unit));
  }
}

const dateio = input => new DateIO(input);

dateio.prototype = DateIO.prototype;

export default dateio;
