/**
 * 统一处理日期或格式化输出
 * Author: Tyler.Chao
 * github: https://github.com/cz848/dateio
 */

// 首字母大写
const capitalize = string => string.replace(/^[a-z]/, a => a.toUpperCase());

// 匹配不同方法的正则
const formatsRegExp = /Mo|mo|MS|ms|[YMDWHISAUymdwhisau]/g;
const getUnitRegExp = /^(?:Mo|mo|MS|ms|[YMDWHISAUymdwhisau])$/;
const setUnitRegExp = /^(?:ms|[Uymdhisu])$/;
const addUnitRegExp = /^([+-]?(?:\d*\.)?\d+)(ms|[ymdwhis])?$/;
const validDateRegExp = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z+$/i;
// 每个时间单位对应的毫秒数或月数
const unitStep = {
  ms: 1,
  s: 1e3,
  i: 6e4,
  h: 36e5,
  d: 864e5,
  w: 864e5 * 7,
  m: 1,
  y: 12,
};
const unitMap = {
  y: 'fullYear',
  m: 'month',
  d: 'date',
  h: 'hours',
  i: 'minutes',
  s: 'seconds',
  ms: 'milliseconds',
};
// 语言包
let I18N = {
  months: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
  monthsShort: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  weekdays: ['日', '一', '二', '三', '四', '五', '六'],
  // 默认四个时段，可根据需要增减
  interval: ['凌晨', '上午', '下午', '晚上'],
};

// 设置语言包
const locale = config => {
  I18N = { ...I18N, ...config };
  return I18N;
};

// from moment.js in order to keep the same result
const monthDiff = (a, b) => {
  const wholeMonthDiff = (b.y - a.y) * 12 + (b.m - a.m);
  const anchor = a.clone().add(wholeMonthDiff, 'm');
  const anchor2 = a.clone().add(wholeMonthDiff + (b > anchor ? 1 : -1), 'm');
  return -(wholeMonthDiff + (b - anchor) / Math.abs(anchor2 - anchor)) || 0;
};

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
    this.I18N = locale();
    this.init(input);
  }

  init(input) {
    const date = toDate(input);
    this.$date = date;
    if (Number.isNaN(+date)) return this;

    const { months, monthsShort, weekdays, interval } = this.I18N;
    const formats = new Date(+date - date.getTimezoneOffset() * 6e4).toISOString().match(validDateRegExp);
    const [, Y, M, D, H, I, S, MS] = formats;
    // 年 (4位)
    // 1970...2019
    this.Y = Y;
    // 年 (4位)
    // 1970...2019
    this.y = Number(Y);
    // 加偏移后的月 (前导0)
    // 01...12
    this.M = M;
    // 月
    // 1...12
    this.m = Number(M);
    // 月份
    this.Mo = months[this.m - 1];
    // 缩写月份
    this.mo = monthsShort[this.m - 1];
    // 日 (前导0)
    // 01...31
    this.D = D;
    // 日
    // 1...31
    this.d = Number(D);
    // 周几
    // 0...6
    this.w = date.getDay();
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
    this.a = interval[Math.floor((this.h / 24) * interval.length)];
    // 时间段
    this.A = this.a.toUpperCase();
    // 毫秒时间戳 (unix格式)
    // 0...1571136267050
    this.u = date.valueOf();
    // 秒时间戳 (unix格式)
    // 0...1542759768
    this.U = Math.round(this.u / 1000);
    return this;
  }

  get(unit = '') {
    return getUnitRegExp.test(unit) ? this[unit] : undefined;
  }

  set(unit = '', ...input) {
    // 遇到非法单位或值直接返回此对象
    if (!setUnitRegExp.test(unit) || !input.length || input.some(isNaN)) return this;
    if (unit === 'u') return this.init(input[0]);
    if (unit === 'U') return this.init(input[0] * 1000);
    // 处理月份，设置的时候需要-1
    if (unit === 'y' && input.length > 1) input[1] -= 1;
    else if (unit === 'm') input[0] -= 1;
    const type = unitMap[unit];
    this.$date[`set${capitalize(type)}`](...input);
    return this.init(this.$date);
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
    return String(formats || 'Y-M-D H:I:S').replace(formatsRegExp, unit => this[unit]);
  }

  // 开始于，默认ms
  startOf(unit, isStartOf = true) {
    let formats = 'y m d h i s';
    formats = formats.slice(0, formats.indexOf(unit === 'w' ? 'd' : unit) + 1);
    if (!formats) return this;
    const dates = this.format(formats).split(' ');
    // 分别对应年/月/日/时/分/秒/毫秒
    const starts = [0, 1, 1, 0, 0, 0, 0];
    const ends = [0, 12, 0, 23, 59, 59, 999];
    const input = isStartOf ? starts : ends;
    input.splice(0, dates.length, ...dates);
    if (isStartOf || !/^[ym]$/.test(unit)) input[1] -= 1;
    if (unit === 'w') input[2] -= this.get('w') - (isStartOf ? 0 : 6);
    return this.init(input);
  }

  // 结束于，默认ms
  endOf(unit) {
    return this.startOf(unit, false);
  }

  // 返回两个日期的差值，精确到毫秒
  // unit: ms: milliseconds(default)|s: seconds|i: minutes|h: hours|d: days|w: weeks|m: months|y: years
  // isFloat: 是否返回小数
  diff(input, unit, isFloat = false) {
    const that = new DateIO(input);
    const md = monthDiff(this, that);
    let diff = this - that;
    if (/^[ym]$/.test(unit)) diff = md / unitStep[unit];
    else diff /= unitStep[unit] || 1;

    return isFloat ? diff : Math.trunc(diff);
  }

  // 对日期进行+-运算，默认精确到毫秒，可传小数
  // input: '7d', '-1m', '10y', '5.5h'等或数字。
  // unit: 'y', 'm', 'd', 'w', 'h', 'i', 's', 'ms'。
  add(input, unit) {
    const pattern = String(input).match(addUnitRegExp);
    if (!pattern) return this;

    const [, addend, addUnit = unit || 'ms'] = pattern;
    // 年月转化为月，并四舍五入
    if (/^[ym]$/.test(addUnit)) return this.set('m', this.get('m') + Number((addend * unitStep[addUnit]).toFixed(0)));
    return this.init(addend * (unitStep[addUnit] || 0) + this.valueOf());
  }

  subtract(input, unit) {
    return this.add(`-${input}`, unit);
  }

  // 是否为闰年
  isLeapYear() {
    const y = this.get('y');
    return y % 100 ? y % 4 === 0 : y % 400 === 0;
  }

  // 获取某月有多少天
  daysInMonth() {
    const monthDays = [31, 28 + Number(this.isLeapYear()), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return monthDays[this.get('m') - 1];
  }

  // 比较两个日期是否具有相同的年/月/日/时/分/秒，默认精确比较到毫秒
  isSame(input, unit) {
    return +this.clone().startOf(unit) === +new DateIO(input).startOf(unit);
  }
}

const dateio = input => new DateIO(input);

dateio.prototype = DateIO.prototype;
dateio.locale = locale;

export default dateio;
