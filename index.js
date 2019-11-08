/**
 * 统一处理日期或格式化输出
 * Author: tyler.chao
 * github: https://github.com/cz848/dateio
 */

// 位数不够前补0，为了更好的兼容，用slice替代padStart
const zeroFill = (number, targetLength = 2) => `00${number}`.slice(-targetLength);

// 首字母大写
const capitalize = str => typeof str === 'string' ? str.replace(/^[a-z]/, a => a.toUpperCase()) : str;

const characterRegExp = /ms|mo|[ymdwhisau]/gi;
const addFormatsRegExp = /^([+-]?(?:\d\.)?\d+)(ms|[ymdwhis])?$/i;
const validDateRegExp = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z+$/i;
const I18N = {
  months: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
  monthsShort: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  weekdays: ['日', '一', '二', '三', '四', '五', '六'],
  // months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  // weekdays: ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat'],
  // 默认四个时段，可根据需要增减
  interval: ['凌晨', '上午', '下午', '晚上'],
};
const unitMap = {
  y: 'fullYear',
  m: 'month',
  d: 'date',
  w: 'day',
  h: 'hours',
  i: 'minutes',
  s: 'seconds',
  ms: 'milliseconds',
};
// function from moment.js in order to keep the same result
const monthDiff = (a, b) => {
  const wholeMonthDiff = (b.y - a.y) * 12 + (b.m - a.m);
  const anchor = a.clone().add(wholeMonthDiff, 'm');
  const c = b < anchor;
  const anchor2 = a.clone().add(wholeMonthDiff + (c ? -1 : 1), 'm');
  return Number(-(wholeMonthDiff + (b - anchor) / Math.abs(anchor2 - anchor)) || 0);
};

// 是否为 DateIO 的实例
// eslint-disable-next-line no-use-before-define
const isInstance = input => input instanceof DateIO;

// 转换为可识别的日期格式
const toDate = input => {
  if (!input) return new Date();
  if (isInstance(input)) return input.$date;
  if (input instanceof Date) return input;
  if (typeof input === 'string') return new Date(input.replace(/[.-]/g, '/'));
  // TODO:与原生行为有出入
  if (Array.isArray(input) && input.length !== 1) return new Date(...input);
  return new Date(input);
};

class DateIO {
  constructor(input = '') {
    this.i18n().init(input);
  }

  i18n(config) {
    this.I18N = { ...I18N, ...config };
    return this;
  }

  init(input) {
    if (input !== undefined) {
      this.$date = toDate(input);
      if (Number.isNaN(this.valueOf())) throw new Error('Invalid Date');
    }

    const { months, monthsShort, weekdays, interval } = this.I18N;
    const formats = new Date(+this.$date - this.$date.getTimezoneOffset() * 6e4).toISOString().match(validDateRegExp);
    const [, Y, M, D, H, I, S, MS] = formats;
    // 年 (4位)
    // 1970...2019
    this.Y = Y;
    // 年 (4位)
    // 1970...2019
    this.y = Number(Y);
    // 加偏移后的月
    // 1...12
    this.M = M;
    // 月 (前导0)
    // 00...11
    this.m = Number(M) - 1;
    // 月份
    this.Mo = months[this.m];
    // 缩写月份
    this.mo = monthsShort[this.m];
    // 日 (前导0)
    // 01...31
    this.D = D;
    // 日
    // 1...31
    this.d = Number(D);
    // 周几
    // 0...6
    this.w = this.$date.getDay();
    // 周几
    // 本地化后的星期x
    this.W = weekdays[this.w];
    // 24小时制
    // 0...23
    this.H = H;
    // 24小时制 (前导0)
    // 00...23
    this.h = Number(H);
    // 分 (前导0)
    // 00...59
    this.I = I;
    // 分
    // 0...59
    this.i = Number(I);
    // 秒 (前导0)
    // 00...59
    this.S = S;
    // 秒
    // 0...59
    this.s = Number(S);
    // 毫秒数(前导0)
    // 0...999
    this.MS = MS;
    // 毫秒数
    // 000...999
    this.ms = Number(MS);
    // 时间段
    this.a = interval[Math.floor(this.h / 24 * interval.length)];
    // 时间段
    this.A = this.a.toUpperCase();
    // 毫秒时间戳 (unix格式)
    // 0...1571136267050
    this.u = this.$date.valueOf();
    // 秒时间戳 (unix格式)
    // 0...1542759768
    this.U = Math.floor(this.u / 1000);
    return this;
  }

  get(unit = 'u') {
    return this[unit] || undefined;
  }

  set(unit, ...input) {
    const type = unitMap[unit.toLowerCase()];
    this.$date[`set${capitalize(type)}`](...input);
    return this.init();
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
  format(formats = 'Y-M-D H:I:S') {
    // 执行相应格式化
    return (formats).replace(characterRegExp, unit => this.get(unit) || unit);
  }

  startOf(unit, isStartOf = true) {
    const formats = 'y m d h i s';
    const format = formats.slice(0, formats.indexOf(unit) + 1);
    const dates = this.format(format).split(' ').map(Math.floor);
    const starts = [0, 0, 1, 0, 0, 0, 0];
    const ends = [0, 11, 0, 23, 59, 59, 999];
    const input = isStartOf ? starts : ends;
    input.splice(0, dates.length, ...dates);
    if (!isStartOf) input[1] += 1;
    return this.init(input);
  }

  endOf(unit) {
    return this.startOf(unit, false);
  }

  // 返回两个日期的差值，精确到毫秒
  // unit: ms: milliseconds(default)|s: seconds|i: minutes|h: hours|d: days|w: weeks|m: months|y: years
  // isFloat: 是否返回小数
  diff(input, unit = 'ms', isFloat = false) {
    const that = new DateIO(input);
    const md = monthDiff(this, that);
    let diff = this - that;
    diff = {
      s: diff / 1e3,
      i: diff / 6e4,
      h: diff / 36e5,
      d: diff / 864e5,
      w: diff / (864e5 * 7),
      m: md,
      y: md / 12,
    }[unit] || diff;

    return isFloat ? diff : Math.floor(diff);
  }

  // 对日期进行+-运算，默认精确到毫秒，可传小数
  // input: '7d', '-1m', '10y', '5.5h'等或数字。
  // unit: 'y', 'm', 'd', 'w', 'h', 'i', 's', 'ms'。
  add(input, unit = 'ms') {
    const pattern = String(input).match(addFormatsRegExp);
    if (!pattern) throw new Error(`Invalid add format`);
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

    if(['m', 'y'].indexOf(mapUnit) >= 0) {
      const integer = Math.floor(number);
      number = Number(number.toString().replace(/^(?:[+-]?)\d+(?=\.?)/g, '0'));
      this.set(mapUnit, this.get(mapUnit) + integer);
    }
    return number ? this.set('u', number * maps[mapUnit] + this.valueOf()) : this;
  }

  subtract(input, unit = 'ms') {
    return this.add(`-${input}`, unit);
  }

  // 计算某个月有几天
  daysInMonth() {
    return this.add('1m').set('d', 0).get('d');
  }

  // 比较两个同格式的日期是否相同，默认精确到毫秒
  isSame(input, unit = 'u') {
    const thisTime = this.get(unit);
    const thatTime = new DateIO(input).get(unit);
    return thisTime !== undefined && thatTime !== undefined && +thisTime === +thatTime;
  }
}

const dateio = input => (isInstance(input) ? input.clone() : new DateIO(input));

dateio.prototype = DateIO.prototype;

export default dateio;
