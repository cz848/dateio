/**
 * 统一处理日期或格式化输出
 * Author: Tyler.Chao
 * github: https://github.com/cz848/dateio
 */

// 位数不够前补0，为了更好的兼容，用slice替代padStart
const zeroFill = (number, targetLength) => `00${number}`.slice(-targetLength || -2);

// 首字母大写
const capitalize = str => str.toString().replace(/^[a-z]/, a => a.toUpperCase());

// 取整数部分
const intPart = n => Number.parseInt(n, 10);

const formatsRegExp = /MS|ms|[YMDWHISAUymdwhisau]/g;
const addUnitsRegExp = /^([+-]?(?:\d\.)?\d+)(ms|[ymdwhis])?$/i;
const I18N = {
  weekdays: ['日', '一', '二', '三', '四', '五', '六'],
  // 默认四个时段，可根据需要增减
  interval: ['凌晨', '上午', '下午', '晚上'],
};

// 是否为 DateIO 的实例
// eslint-disable-next-line no-use-before-define
const isInstance = input => input instanceof DateIO;

// 转换为可识别的日期格式
const toDate = input => {
  if (!(input || input === 0)) return new Date();
  if (isInstance(input)) return input.$date;
  if (input instanceof Date) return input;
  // fix: ISOString
  if (typeof input === 'string' && !/Z$/i.test(input)) return new Date(input.replace(/-/g, '/'));
  // TODO: 与原生行为有出入
  if (Array.isArray(input) && input.length !== 1) return new Date(...input);
  return new Date(input);
};

class DateIO {
  constructor(input = '') {
    this.i18n().init(input);
  }

  init(input) {
    if (input !== undefined) {
      this.$date = toDate(input);
    }
    return this;
  }

  i18n(config) {
    this.I18N = { ...I18N, ...config };
    return this;
  }

  $get(type) {
    const value = this.$date[`get${capitalize(type)}`]();
    return value + (type === 'month');
  }

  $set(type, ...input) {
    if (type === 'fullYear' && input.length > 1) input[1] -= 1;
    else if (type === 'month') input[0] -= 1;
    this.$date[`set${capitalize(type)}`](...input);
    return this;
  }

  // 年
  // 100...2019
  y(...input) {
    return input.length ? this.$set('fullYear', ...input) : this.$get('fullYear');
  }

  // 年 (4位)
  // 0100...2019
  Y() {
    return zeroFill(this.y(), 4);
  }

  // 加偏移后的月
  // 1...12
  m(...input) {
    return input.length ? this.$set('month', ...input) : this.$get('month');
  }

  // 月 (前导0)
  // 01...12
  M() {
    return zeroFill(this.m());
  }

  // 日
  // 1...31
  d(...input) {
    return input.length ? this.$set('date', ...input) : this.$get('date');
  }

  // 日 (前导0)
  // 01...31
  D() {
    return zeroFill(this.d());
  }

  // 周几
  // 0...6
  w() {
    return this.$get('day');
  }

  // 周几
  // 本地化后的星期x
  W() {
    return this.I18N.weekdays[this.w()];
  }

  // 24小时制
  // 0...23
  h(...input) {
    return input.length ? this.$set('hours', ...input) : this.$get('hours');
  }

  // 24小时制 (前导0)
  // 00...23
  H() {
    return zeroFill(this.h());
  }

  // 分
  // 0...59
  i(...input) {
    return input.length ? this.$set('minutes', ...input) : this.$get('minutes');
  }

  // 分 (前导0)
  // 00...59
  I() {
    return zeroFill(this.i());
  }

  // 秒
  // 0...59
  s(...input) {
    return input.length ? this.$set('seconds', ...input) : this.$get('seconds');
  }

  // 秒 (前导0)
  // 00...59
  S() {
    return zeroFill(this.s());
  }

  // 毫秒数
  // 0...999
  ms(...input) {
    return input.length ? this.$set('milliseconds', ...input) : this.$get('milliseconds');
  }

  MS() {
    return zeroFill(this.ms(), 3);
  }

  // 时间段
  a() {
    const len = this.I18N.interval.length;
    return this.I18N.interval[Math.floor(this.h() / 24 * len)];
  }

  // 时间段
  A() {
    return this.a().toUpperCase();
  }

  // 毫秒时间戳 (unix格式)
  // 0...1571136267050
  u(input) {
    return input ? this.init(input) : this.valueOf();
  }

  // 秒时间戳 (unix格式)
  // 0...1542759768
  U(input) {
    return input ? this.u(input * 1000) : Math.floor(this.u() / 1000);
  }

  // 获取以上格式的日期，每个unit对应其中一种格式
  get(unit = '') {
    const fs = this[unit];
    return typeof fs === 'function' ? fs.call(this) : undefined;
  }

  // 设置以上格式的日期
  set(unit = '', ...input) {
    const fs = this[unit.toLowerCase()];
    return typeof fs === 'function' ? fs.call(this, ...input) : this;
  }

  toDate() {
    return this.$date;
  }

  toString() {
    return this.$date.toString();
  }

  toLocaleString(...input) {
    return this.$date.toLocaleString(...input);
  }

  valueOf() {
    return this.$date.valueOf();
  }

  clone() {
    return new DateIO(+this.$date);
  }

  // 利用格式化串格式化日期
  format(formats) {
    // 执行相应格式化
    return (formats || 'Y-M-D H:I:S').replace(formatsRegExp, unit => this.get(unit));
  }

  // 返回两个日期的差值，精确到毫秒
  // unit: ms: milliseconds(default)|s: seconds|i: minutes|h: hours|d: days|w: weeks|m: months|y: years
  // isFloat: 是否返回小数
  diff(input, unit = 'ms', isFloat = false) {
    const time = toDate(input);
    let diff = this - time;
    /* eslint-disable no-fallthrough */
    switch (unit) {
      case 'y': // ~
        diff /= 12;
      case 'm': // ~
        diff /= 30;
      case 'w':
        if (unit === 'w') diff /= 7;
      case 'd':
        diff /= 24;
      case 'h':
        diff /= 60;
      case 'i':
        diff /= 60;
      case 's':
        diff /= 1000;
      default:
    }
    /* eslint-enable no-fallthrough */

    return isFloat ? diff : intPart(diff);
  }

  // 对日期进行+-运算，默认精确到毫秒，可传小数
  // input: '7d', '-1m', '10y', '5.5h'等或数字。
  // unit: 'y', 'm', 'd', 'w', 'h', 'i', 's', 'ms'。
  add(input, unit = 'ms') {
    const pattern = String(input).match(addUnitsRegExp);
    if (!pattern) return this;
    const mapUnit = (pattern[2] || unit).toString().toLowerCase();
    let number = Number(pattern[1]);
    const maps = {
      ms: 1,
      s: 1e3,
      i: 6e4,
      h: 36e5,
      d: 864e5,
      w: 864e5 * 7,
      m: 864e5 * 30, // ~
      y: 864e5 * 365, // ~
    };

    if (['m', 'y'].indexOf(mapUnit) >= 0) {
      const integer = intPart(number);
      number = Number(number.toString().replace(/^(-?)\d+(?=\.?)/g, '$10'));
      this.set(mapUnit, this.get(mapUnit) + integer);
    }
    return number ? this.set('u', number * maps[mapUnit] + this.valueOf()) : this;
  }

  subtract(input, unit = 'ms') {
    return this.add(`-${input}`, unit);
  }

  // 是否为闰年
  isLeapYear() {
    const y = this.get('y');
    return y % 100 ? y % 4 === 0 : y % 400 === 0;
  }

  // 获取某月有多少天
  daysInMonth() {
    const monthDays = [31, 28 + this.isLeapYear(), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return monthDays[this.get('m') - 1];
  }

  // 比较两个日期是否具有相同的年/月/日/时/分/秒，默认精确比较到毫秒
  isSame(input, unit = 'u') {
    const thisTime = this.get(unit);
    const thatTime = new DateIO(input).get(unit);
    return thisTime !== undefined && thatTime !== undefined && +thisTime === +thatTime;
  }
}

const dateio = input => (isInstance(input) ? input.clone() : new DateIO(input));

dateio.prototype = DateIO.prototype;

export default dateio;
