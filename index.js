/**
 * 统一处理日期或格式化输出
 * Author: Tyler.Chao
 * github: https://github.com/cz848/dateio
 */

// 位数不够前补0，为了更好的兼容，用slice替代padStart
const zeroFill = (number, targetLength) => `00${number}`.slice(-targetLength || -2);

// 匹配不同方法的正则
const characterRegExp = /MS|ms|[YMDWHISAUymdwhisau]/g;

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
    const units = {
      y: 'getFullYear',
      m: 'getMonth',
      d: 'getDate',
      w: 'getDay',
      h: 'getHours',
      i: 'getMinutes',
      s: 'getSeconds',
      ms: 'getMilliseconds',
      u: 'valueOf',
    };
    let res;
    // 同一个正则需重置计数
    characterRegExp.lastIndex = 0;
    if (characterRegExp.test(unit)) {
      const api = units[unit.toLowerCase()];
      res = this.$date[api]();
      if (/[mMW]/.test(unit)) res += 1;
    }
    if (/[MDHIS]/.test(unit)) {
      res = zeroFill(res, unit === 'MS' ? 3 : 2);
    } else if (unit === 'y') {
      res = res.toString().slice(-2);
    } else if (unit === 'U') {
      res = Math.round(res / 1000);
    }
    return res;
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
