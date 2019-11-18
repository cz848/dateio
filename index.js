/**
 * 统一处理日期或格式化输出
 * Author: Tyler.Chao
 * github: https://github.com/cz848/dateio
 */

// 匹配不同方法的正则
const characterRegExp = /MS|ms|[YMDWHISUymdwhisu]/g;
const validDateRegExp = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z+$/i;

// 转换为可识别的日期格式
const toDate = input => {
  if (!(input || input === 0)) return new Date();
  // fix: ISOString
  if (typeof input === 'string' && !/Z$/i.test(input)) return new Date(input.replace(/-/g, '/'));
  // TODO: 与原生行为有出入
  if (Array.isArray(input) && input.length !== 1) return new Date(...input);
  return new Date(input);
};

class DateIO {
  constructor(input) {
    this.init(input);
  }

  init(input) {
    this.$date = toDate(input);
    return this;
  }

  // 获取不同格式的日期，每个unit对应一种格式
  get(unit = '') {
    const formats = new Date(+this.$date - this.$date.getTimezoneOffset() * 6e4).toISOString().match(validDateRegExp);
    const [, Y, M, D, H, I, S, MS] = formats;
    const units = {
      Y,
      M,
      D,
      H,
      I,
      S,
      MS,
      y: Number(Y.slice(-2)),
      w: this.$date.getDay(),
      W: '日一二三四五六'[this.$date.getDay()],
      u: +this.$date,
      U: Math.round(this.$date / 1000),
    };
    if (/^MS|[YMDWHISUywu]$/.test(unit)) return units[unit];
    if (/ms|[mdhis]/.test(unit)) return Number(units[unit.toUpperCase()]);
  }

  toString() {
    return this.$date.toString();
  }

  valueOf() {
    return this.$date.valueOf();
  }

  // 利用格式化串格式化日期
  format(formats) {
    return String(formats || 'Y-M-D H:I:S').replace(characterRegExp, unit => this.get(unit));
  }
}

const dateio = input => new DateIO(input);

dateio.prototype = DateIO.prototype;

export default dateio;
