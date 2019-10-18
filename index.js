/**
 * 统一处理日期或格式化输出
 */

const characterRegExp = /[ymdwhisau]/gi;
const addFormatsRegExp = /^([+-]?)((?:\d\.)?\d+)([ymdwhis]?)$/i;
const I18N = {
  weekdays: ['日', '一', '二', '三', '四', '五', '六'],
  apm: ['上午', '下午'],
};

// 位数不够前补0
const zeroFill = (number, targetLength = 2) => `00${number}`.slice(-targetLength);

// 是否为datetime的实例
// eslint-disable-next-line no-use-before-define
const isInstance = input => input instanceof DateTime;

// 转换为可识别的日期格式
const toDate = input => {
  if (!input) return new Date();
  if (isInstance(input)) return input;
  // if (typeof input === 'function') toDate(input());
  if (typeof input === 'string') return new Date(input.replace(/[.-]/g, '/'));
  // TODO:与原生行为不符，需优化
  if (Array.isArray(input)) return new Date(...input);
  return new Date(input);
};

class DateTime {
  constructor(input) {
    this.I18N = I18N;
    this.origin = input;
    this.init();
  }

  init() {
    this.$date = toDate(this.origin);
    if (Number.isNaN(this.valueOf())) throw new Error(`Invalid Date: ${this.origin}, type: ${typeof this.origin}.`);
    return this;
  }

  toDate() {
    return toDate(this.$date);
  }

  // 年 (4位)
  // 1970...2018
  Y() {
    return this.$date.getFullYear();
  }

  // 年 (2位)
  // 70...18
  y(...input) {
    return input.length ? this.$date.setFullYear(...input) : this.Y().toString().slice(-2);
  }

  // 修正偏移后的月
  // 1...12
  m(...input) {
    return input.length ? this.$date.setMonth(...input) : this.$date.getMonth() + 1;
  }

  // 月 (前导0)
  // 01...12
  M() {
    return zeroFill(this.m());
  }

  // 日
  // 1...31
  d(...input) {
    return input.length ? this.$date.setDate(...input) : this.$date.getDate();
  }

  // 日 (前导0)
  // 01...31
  D() {
    return zeroFill(this.d());
  }

  // 周几
  // 0...6
  w() {
    return this.$date.getDay();
  }

  // 周几
  // 本地化后的星期x
  W() {
    return this.I18N.weekdays[this.w()];
  }

  // 24小时制
  // 0...23
  h(...input) {
    return input.length ? this.$date.setHours(...input) : this.$date.getHours();
  }

  // 24小时制 (前导0)
  // 00...23
  H() {
    return zeroFill(this.h());
  }

  // 分
  // 0...59
  i(...input) {
    return input.length ? this.$date.setMinutes(...input) : this.$date.getMinutes();
  }

  // 分 (前导0)
  // 00...59
  I() {
    return zeroFill(this.i());
  }

  // 秒
  // 0...59
  s(...input) {
    return input.length ? this.$date.setSeconds(...input) : this.$date.getSeconds();
  }

  // 秒 (前导0)
  // 00...59
  S() {
    return zeroFill(this.s());
  }

  // 上下午
  // am/pm
  a() {
    return this.I18N.apm[Math.floor(this.h() / 12)];
  }

  // 上下午
  // AM/PM
  A() {
    return this.a().toUpperCase();
  }

  // 毫秒 (unix格式)
  // 0...1542759768000
  u(input) {
    return input ? this.$date.setMilliseconds(input) : this.valueOf();
  }

  // 秒 (unix格式)
  // 0...1542759768
  U() {
    return Math.floor(this.u() / 1000);
  }

  // 获取以上格式的日期
  get(formats) {
    const fs = this[formats];
    return typeof fs === 'function' ? fs.call(this) : undefined;
  }

  // 设置以上格式的日期
  set(formats, ...input) {
    if (typeof this[formats.toLowerCase()] !== 'function') throw new Error(`Invalid set format: ${formats}.`);
    this.origin = this[formats.toLowerCase()](...input);
    return this.init();
  }

  toString() {
    return this.$date.toString();
  }

  toLocaleString(...input) {
    return this.$date.toLocaleString(...input);
  }

  valueOf() {
    return +this.$date;
  }

  clone() {
    return new DateTime(this.origin);
  }

  // 利用格式化串格式化日期
  format(formats) {
    // 执行相应格式化
    return (formats || '').replace(characterRegExp, key => {
      const fs = this[key];
      return typeof fs === 'function' ? fs.call(this) : fs || this.$date;
    });
  }

  // 返回两个日期的差值，精确到秒
  // formats: s: seconds(default)|i: minutes|h: hours|d: days|m:month(~)|y:year(~)
  diff(input, formats) {
    const time = toDate(input);
    let diff = Math.floor((time - this) / 1000);
    /* eslint-disable no-fallthrough */
    switch (formats) {
      case 'y':
        diff /= 12;
      case 'm':
        diff /= 30;
      // case 'w':
      //   diff /= 7;
      case 'd':
        diff /= 24;
      case 'h':
        diff /= 60;
      case 'i':
        diff /= 60;
      default:
    }
    /* eslint-enable no-fallthrough */

    return diff;
  }

  to(input, formats = 's') {
    const pattern = String(input).match(addFormatsRegExp);
    if (!pattern) throw new Error(`Invalid to format: ${formats}.`);
    const sign = pattern[1] === '-' ? -1 : 1;
    const getFormat = (pattern[3] || formats);
    const setFormat = getFormat.toLowerCase();
    let number = Number(pattern[2]);
    number = setFormat === 'm' ? (number - 1) : number;
    const decimal = number.toString().split('.')[1];
    const maps = {
      i: 60,
      h: 3600,
      d: 86400,
      w: 86400 * 7,
      m: 86400 * 30, // ~
      y: 86400 * 360, // ~
    };
    // 兼容小数(主要w以下~)
    if (decimal) return this.set('u', sign * number * maps[setFormat] * 1000);
    return this.set(setFormat, sign * number + Number(this.get(getFormat)));
  }

  daysInMonth() {
    return this.to('1m').set('d', 0).d();
  }

  isSame(input, formats = 'U') {
    const thisTime = this.get(formats);
    const thatTime = new DateTime(input).get(formats);
    return thisTime !== undefined && thatTime !== undefined && +thisTime === +thatTime;
  }

  i18n(conf = {}) {
    this.I18N = { ...I18N, ...conf };
    return this;
  }
}

const datetime = input => (isInstance(input) ? input.clone() : new DateTime(input));

datetime.prototype = DateTime.prototype;

export default datetime;
