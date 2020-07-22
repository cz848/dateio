import moment from 'moment';
import MockDate from 'mockdate';
import dateio from '../index';

beforeEach(() => {
  MockDate.set(new Date());
});

afterEach(() => {
  MockDate.reset();
});

console.warn = () => {}; // moment.js '2018-4-1 1:1:1:22' will throw warn

describe('Constructor', () => {
  test('instanceof', () => {
    expect(dateio()).toBeInstanceOf(dateio);
    expect(dateio().get('y')).not.toBeInstanceOf(dateio);
    expect(dateio().format()).not.toBeInstanceOf(dateio);
  });

  test('Now', () => {
    expect(dateio().valueOf()).toBe(moment().valueOf());
    expect(+dateio()).toEqual(+new Date());
  });

  test('moment-js like formatted dates', () => {
    let d = '2013/01/08';
    const s = 'YYYY-MM-DD HH:mm:ss';
    expect(dateio(d).valueOf()).toBe(moment(d).valueOf());
    d = '2018-04-24';
    expect(dateio(d).valueOf()).toBe(moment(d).valueOf());
    d = '2018-04-24 11:12';
    expect(dateio(d).format()).toBe(moment(d).format(s));
    d = '2018-05-02 11:12:13';
    expect(dateio(d).valueOf()).toBe(moment(d).valueOf());
    d = '2018-05-02 11:12:13.998';
    expect(dateio(d).valueOf()).toBe(moment(d).valueOf());
    d = '2018-4-1';
    expect(dateio(d).valueOf()).toBe(moment(d).valueOf());
    d = '2018-4-1 11:12';
    expect(dateio(d).format()).toBe(moment(d).format(s));
    d = '2018-4-1 1:1:1:023';
    expect(dateio(d).valueOf()).toBe(moment(d).valueOf());
    d = '2018-01';
    expect(dateio(d).valueOf()).toBe(moment(d).valueOf());
    d = '2018';
    expect(dateio(d).format()).toBe(moment(d).format(s));
    d = '2018-05-02T11:12';
    expect(dateio(d).format()).toBe(moment(d).format(s));
    d = '2018-05-02T11:12:13.432Z';
    expect(dateio(d).format()).toBe(moment(d).format(s));
  });

  test('String ISO 8601 date, time and zone', () => {
    const time = '2018-04-04T16:00:00.000Z';
    expect(dateio(time).valueOf()).toBe(moment(time).valueOf());
  });

  test('String RFC 2822, time and zone', () => {
    const time = 'Mon, 11 Feb 2019 16:46:50 GMT+8';
    const expected = '2019-02-11T08:46:50.000Z';
    expect(dateio(time).valueOf()).toBe(moment(time).valueOf());
    expect(+dateio(time)).toBe(+dateio(expected));
  });

  test('String ECMAScript, time and zone', () => {
    // should parse dates formatted in ECMA script format
    // see https://www.ecma-international.org/ecma-262/9.0/index.html#sec-date.prototype.tostring
    const time = 'Mon Feb 11 2019 11:01:37 GMT+0100 (Mitteleuropäische Normalzeit)';
    const expected = '2019-02-11T10:01:37.000Z';
    expect(dateio(time).valueOf()).toBe(moment(time).valueOf());
    expect(dateio(time).format()).toBe(dateio(expected).format());
  });

  test('With Date or DateIO object', () => {
    const a = dateio();
    const b = dateio(a);
    const c = new Date();
    const d = dateio(c);
    expect(+a).toBe(+b);
    expect(+a).toBe(+c);
    expect(+c).toBe(+d);
  });

  test('Other', () => {
    expect(dateio(() => '2018-01-01').$date).toBeInstanceOf(Date);
    expect(+dateio([2018, 5, 1, 13, 52, 44])).toBe(+moment([2018, 4, 1, 13, 52, 44]));
    expect(+dateio([2018])).toBe(+moment([2018]));
    expect(+dateio(2018)).toBe(+moment(2018));
    expect(+dateio([2018, 2])).toBe(+moment([2018, 1]));
    expect(+dateio(2018, 2, 1)).toBe(+moment(2018));
    expect(+dateio([1987, 6])).toBe(+moment([1987, 5]));
    expect(+dateio([1941, 9, 10])).toBe(+moment([1941, 8, 10]));
    // expect(+dateio([0])).toBe(+moment([0]));
  });

  test('Invalid values', () => {
    expect(dateio({}).toString()).toBe(new Date('').toString());
    expect(dateio('otherString').toString().toLowerCase()).toBe(moment('otherString').toString().toLowerCase());
    expect(dateio(null).toString().toLowerCase().replace(/ \(.+\)$/, '')).toBe(moment().toString().toLowerCase());
    expect(dateio(undefined).toString().toLowerCase().replace(/ \(.+\)$/, '')).toBe(moment(undefined).toString().toLowerCase());
    expect(dateio(NaN).toString().toLowerCase()).toBe(moment(NaN).toString().toLowerCase());
  });

  test('Number 0', () => {
    expect(dateio(0).valueOf()).toBe(moment(0).valueOf());
  });

  test('Unix Timestamp Number (milliseconds)', () => {
    const timestamp = 1523520536000;
    expect(dateio(timestamp).valueOf()).toBe(moment(timestamp).valueOf());
  });
});
