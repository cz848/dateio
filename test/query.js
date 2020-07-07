import MockDate from 'mockdate';
import moment from 'moment';
import dateio from '../index';

beforeEach(() => {
  MockDate.set(new Date());
});

afterEach(() => {
  MockDate.reset();
});

describe('Is Same', () => {
  test('Compare to object', () => {
    const dayA = dateio();
    const dayB = dayA.clone().add(1, 'd');
    const dayC = dayA.clone().subtract(1, 'd');
    expect(dayA.isSame(dateio())).toBe(true);
    expect(dayA.isSame(dayB)).toBe(false);
    expect(dayA.isSame(dayB)).toBe(false);
    expect(dayA.isSame(dayC)).toBe(false);
    expect(dayA.isSame(dayC)).toBe(false);
    expect(dayA.isSame(moment())).toBe(true);
  });

  test('No value', () => {
    const dayA = dateio();
    const dayB = dayA.clone().add(1, 'd');
    const dayC = dayA.clone().subtract(1, 'd');
    expect(dayA.isSame()).toBe(true);
    expect(dayB.isSame()).toBe(false);
    expect(dayC.isSame()).toBe(false);
  });

  test('With string', () => {
    const dayD = dateio();
    expect(dayD.isSame('1982/01/01')).toBe(false);
    expect(dayD.isSame('2006/01/01', 'y')).toBe(false);
    expect(dayD.isSame('2008-05-01')).toBe(false);
  });

  test('With invalid moments', () => {
    expect(dateio(null).isSame(dateio('2018-01-01'))).toBe(false);
    expect(dateio('2018-01-01').isSame(dateio(undefined))).toBe(false);
    expect(dateio('some bad moments').isSame(dateio('2018-01-01'))).toBe(false);
    expect(dateio(null).isSame(dateio())).toBe(true);
    expect(dateio().isSame(dateio(undefined))).toBe(true);
  });

  test('without units(ms)', () => {
    const m = dateio(new Date(2011, 3, 2, 3, 4, 5, 10));
    const mCopy = m.clone();

    expect(m.isSame(dateio(new Date(2012, 3, 2, 3, 5, 5, 10)))).toBe(false, '晚了一年');
    expect(m.isSame(dateio(new Date(2010, 3, 2, 3, 3, 5, 10)))).toBe(false, '早了一年');
    expect(m.isSame(dateio(new Date(2011, 4, 2, 3, 4, 5, 10)))).toBe(false, '晚了一月');
    expect(m.isSame(dateio(new Date(2011, 2, 2, 3, 4, 5, 10)))).toBe(false, '早了一月');
    expect(m.isSame(dateio(new Date(2011, 3, 3, 3, 4, 5, 10)))).toBe(false, '晚了一天');
    expect(m.isSame(dateio(new Date(2011, 3, 1, 3, 4, 5, 10)))).toBe(false, '早了一天');
    expect(m.isSame(dateio(new Date(2011, 3, 2, 4, 4, 5, 10)))).toBe(false, '晚了一小时');
    expect(m.isSame(dateio(new Date(2011, 3, 2, 2, 4, 5, 10)))).toBe(false, '早了一小时');
    expect(m.isSame(dateio(new Date(2011, 3, 2, 3, 5, 5, 10)))).toBe(false, '晚了一分钟');
    expect(m.isSame(dateio(new Date(2011, 3, 2, 3, 3, 5, 10)))).toBe(false, '早了一分钟');
    expect(m.isSame(dateio(new Date(2011, 3, 2, 3, 4, 6, 10)))).toBe(false, '晚了一秒钟');
    expect(m.isSame(dateio(new Date(2011, 3, 2, 3, 4, 4, 10)))).toBe(false, '早了一秒钟');
    expect(m.isSame(dateio(new Date(2011, 3, 2, 3, 4, 5, 10)))).toBe(true, '匹配到毫秒');
    expect(m.isSame(dateio(new Date(2011, 3, 2, 3, 4, 5, 11)))).toBe(false, '晚了一毫秒');
    expect(m.isSame(dateio(new Date(2011, 3, 2, 3, 4, 5, 9)))).toBe(false, '早了一毫秒');
    expect(m.isSame(m)).toBe(true, 'dateio实例自身是相等的');
    expect(+m).toEqual(+mCopy, '比较之后不会改变自身的值');
  });

  test('year', () => {
    const m = dateio(new Date(2011, 1, 2, 3, 4, 5, 6));
    const mCopy = dateio(m);
    expect(m.isSame(dateio(new Date(2011, 5, 6, 7, 8, 9, 10)), 'y')).toBe(true, '同年');
    expect(m.isSame(dateio(new Date(2012, 5, 6, 7, 8, 9, 10)), 'y')).toBe(false, '不同年');
    expect(m.isSame(dateio(new Date(2011, 0, 1, 0, 0, 0, 0)), 'y')).toBe(true, '开始于同一年');
    expect(m.isSame(dateio(new Date(2011, 11, 31, 23, 59, 59, 999)), 'y')).toBe(true, '结束于同一年');
    expect(m.isSame(dateio(new Date(2012, 0, 1, 0, 0, 0, 0)), 'y')).toBe(false, '下一年的开始');
    expect(m.isSame(dateio(new Date(2010, 11, 31, 23, 59, 59, 999)), 'y')).toBe(false, '前一年的结束');
    expect(m.isSame(m, 'y')).toBe(true, 'dateio实例自身年份是相等的');
    expect(+m).toEqual(+mCopy, '用年比较之后不会改变自身的值');
  });

  test('month', () => {
    const m = dateio(new Date(2011, 2, 3, 4, 5, 6, 7));
    const mCopy = dateio(m);
    expect(m.isSame(dateio(new Date(2011, 2, 6, 7, 8, 9, 10)), 'm')).toBe(true, '同年同月');
    expect(m.isSame(dateio(new Date(2012, 2, 6, 7, 8, 9, 10)), 'm')).toBe(false, '不同年');
    expect(m.isSame(dateio(new Date(2011, 5, 6, 7, 8, 9, 10)), 'm')).toBe(false, '不同月');
    expect(m.isSame(dateio(new Date(2011, 2, 1, 0, 0, 0, 0)), 'm')).toBe(true, '开始于同月');
    expect(m.isSame(dateio(new Date(2011, 2, 31, 23, 59, 59, 999)), 'm')).toBe(true, '结束于同月');
    expect(m.isSame(dateio(new Date(2011, 3, 1, 0, 0, 0, 0)), 'm')).toBe(false, '下月的开始');
    expect(m.isSame(dateio(new Date(2011, 1, 27, 23, 59, 59, 999)), 'm')).toBe(false, '上月的结束');
    expect(m.isSame(m, 'm')).toBe(true, 'dateio实例自身月份是相等的');
    expect(+m).toEqual(+mCopy, '用月比较之后不会改变自身的值');
  });

  test('day', () => {
    const m = dateio(new Date(2011, 1, 2, 3, 4, 5, 6));
    const mCopy = dateio(m);
    expect(m.isSame(dateio(new Date(2011, 1, 2, 7, 8, 9, 10)), 'd')).toBe(true, '同年同月同日');
    expect(m.isSame(dateio(new Date(2012, 1, 2, 7, 8, 9, 10)), 'd')).toBe(false, '不同年');
    expect(m.isSame(dateio(new Date(2011, 2, 2, 7, 8, 9, 10)), 'd')).toBe(false, '不同月');
    expect(m.isSame(dateio(new Date(2011, 1, 3, 7, 8, 9, 10)), 'd')).toBe(false, '不同日');
    expect(m.isSame(dateio(new Date(2011, 1, 2, 0, 0, 0, 0)), 'd')).toBe(true, '开始于同一天');
    expect(m.isSame(dateio(new Date(2011, 1, 2, 23, 59, 59, 999)), 'd')).toBe(true, '结束于同一天');
    expect(m.isSame(dateio(new Date(2011, 1, 3, 0, 0, 0, 0)), 'd')).toBe(false, '明天的开始');
    expect(m.isSame(dateio(new Date(2011, 1, 1, 23, 59, 59, 999)), 'd')).toBe(false, '昨天的结束');
    expect(m.isSame(m, 'd')).toBe(true, 'dateio实例自身天数是相等的');
    expect(+m).toEqual(+mCopy, '用天比较之后不会改变自身的值');
  });

  test('hour', () => {
    const m = dateio(new Date(2011, 1, 2, 3, 4, 5, 6));
    const mCopy = dateio(m);
    expect(m.isSame(dateio(new Date(2011, 1, 2, 3, 8, 9, 10)), 'h')).toBe(true, '日期和小时匹配');
    expect(m.isSame(dateio(new Date(2012, 1, 2, 3, 8, 9, 10)), 'h')).toBe(false, '不同年');
    expect(m.isSame(dateio(new Date(2011, 2, 2, 3, 8, 9, 10)), 'h')).toBe(false, '不同月');
    expect(m.isSame(dateio(new Date(2011, 1, 3, 3, 8, 9, 10)), 'h')).toBe(false, '不同日');
    expect(m.isSame(dateio(new Date(2011, 1, 2, 4, 8, 9, 10)), 'h')).toBe(false, '不同时');
    expect(m.isSame(dateio(new Date(2011, 1, 2, 3, 0, 0, 0)), 'h')).toBe(true, '开始于同一小时');
    expect(m.isSame(dateio(new Date(2011, 1, 2, 3, 59, 59, 999)), 'h')).toBe(true, '结束于同一小时');
    expect(m.isSame(dateio(new Date(2011, 1, 2, 4, 0, 0, 0)), 'h')).toBe(false, '下一小时的开始');
    expect(m.isSame(dateio(new Date(2011, 1, 2, 2, 59, 59, 999)), 'h')).toBe(false, '上一小时的结束');
    expect(m.isSame(m, 'h')).toBe(true, 'dateio实例自身小时是相等的');
    expect(+m).toEqual(+mCopy, '用小时比较之后不会改变自身的值');
  });

  test('minute', () => {
    const m = dateio(new Date(2011, 1, 2, 3, 4, 5, 6));
    const mCopy = dateio(m);
    expect(m.isSame(dateio(new Date(2011, 1, 2, 3, 4, 9, 10)), 'i')).toBe(true, '同一天的时分匹配');
    expect(m.isSame(dateio(new Date(2012, 1, 2, 3, 4, 9, 10)), 'i')).toBe(false, '不同年');
    expect(m.isSame(dateio(new Date(2011, 2, 2, 3, 4, 9, 10)), 'i')).toBe(false, '不同月');
    expect(m.isSame(dateio(new Date(2011, 1, 3, 3, 4, 9, 10)), 'i')).toBe(false, '不同天');
    expect(m.isSame(dateio(new Date(2011, 1, 2, 4, 4, 9, 10)), 'i')).toBe(false, '不同时');
    expect(m.isSame(dateio(new Date(2011, 1, 2, 3, 5, 9, 10)), 'i')).toBe(false, '不同分');
    expect(m.isSame(dateio(new Date(2011, 1, 2, 3, 4, 0, 0)), 'i')).toBe(true, '开始于同一分钟');
    expect(m.isSame(dateio(new Date(2011, 1, 2, 3, 4, 59, 999)), 'i')).toBe(true, '结束于同一分钟');
    expect(m.isSame(dateio(new Date(2011, 1, 2, 3, 5, 0, 0)), 'i')).toBe(false, '下一分钟的开始');
    expect(m.isSame(dateio(new Date(2011, 1, 2, 3, 3, 59, 999)), 'i')).toBe(false, '下一分钟的结束');
    expect(m.isSame(m, 'i')).toBe(true, 'dateio实例自身分钟是相等的');
    expect(+m).toEqual(+mCopy, '用分钟比较之后不会改变自身的值');
  });

  test('second', () => {
    const m = dateio(new Date(2011, 1, 2, 3, 4, 5, 6));
    const mCopy = dateio(m);
    expect(m.isSame(dateio(new Date(2011, 1, 2, 3, 4, 5, 10)), 's')).toBe(true, '匹配到秒');
    expect(m.isSame(dateio(new Date(2012, 1, 2, 3, 4, 5, 10)), 's')).toBe(false, '不同年');
    expect(m.isSame(dateio(new Date(2011, 2, 2, 3, 4, 5, 10)), 's')).toBe(false, '不同月');
    expect(m.isSame(dateio(new Date(2011, 1, 3, 3, 4, 5, 10)), 's')).toBe(false, '不同日');
    expect(m.isSame(dateio(new Date(2011, 1, 2, 4, 4, 5, 10)), 's')).toBe(false, '不同时');
    expect(m.isSame(dateio(new Date(2011, 1, 2, 3, 5, 5, 10)), 's')).toBe(false, '不同分');
    expect(m.isSame(dateio(new Date(2011, 1, 2, 3, 4, 6, 10)), 's')).toBe(false, '不同秒');
    expect(m.isSame(dateio(new Date(2011, 1, 2, 3, 4, 5, 0)), 's')).toBe(true, '开始于同一秒钟');
    expect(m.isSame(dateio(new Date(2011, 1, 2, 3, 4, 5, 999)), 's')).toBe(true, '结束于同一秒钟');
    expect(m.isSame(dateio(new Date(2011, 1, 2, 3, 4, 6, 0)), 's')).toBe(false, '下一秒钟的开始');
    expect(m.isSame(dateio(new Date(2011, 1, 2, 3, 4, 4, 999)), 's')).toBe(false, '下一秒钟的结束');
    expect(m.isSame(m, 's')).toBe(true, 'dateio实例自身秒数是相等的');
    expect(+m).toEqual(+mCopy, '用秒钟比较之后不会改变自身的值');
  });

  test('millisecond', () => {
    const m = dateio(new Date(2011, 3, 2, 3, 4, 5, 10));
    const mCopy = dateio(m);
    expect(m.isSame(dateio(new Date(2011, 3, 2, 3, 4, 5, 10)), 'ms')).toBe(true, '匹配到毫秒');
    expect(m.isSame(dateio(new Date(2012, 3, 2, 3, 4, 5, 10)), 'ms')).toBe(false, '不同年');
    expect(m.isSame(dateio(new Date(2011, 4, 2, 3, 4, 5, 10)), 'ms')).toBe(false, '不同月');
    expect(m.isSame(dateio(new Date(2011, 3, 3, 3, 4, 5, 10)), 'ms')).toBe(false, '不同日');
    expect(m.isSame(dateio(new Date(2011, 3, 2, 4, 4, 5, 10)), 'ms')).toBe(false, '不同时');
    expect(m.isSame(dateio(new Date(2011, 3, 2, 3, 5, 5, 10)), 'ms')).toBe(false, '不同分');
    expect(m.isSame(dateio(new Date(2011, 3, 2, 3, 4, 6, 10)), 'ms')).toBe(false, '不同秒');
    expect(m.isSame(dateio(new Date(2011, 3, 2, 3, 4, 6, 11)), 'ms')).toBe(false, '不同毫秒');
    expect(m.isSame(m, 'ms')).toBe(true, 'dateio实例自身毫秒数是相等的');
    expect(+m).toEqual(+mCopy, '用毫秒比较之后不会改变自身的值');
  });
});

describe('Is Leap Year', () => {
  test('No value', () => {
    expect(dateio().isLeapYear()).toBe(moment().isLeapYear());
  });

  test('With some moments', () => {
    expect(dateio('2000/01/01').isLeapYear()).toBe(true);
    expect(dateio('2019-01-01 10:30').isLeapYear()).toBe(false);
    expect(dateio('2020-05-4').isLeapYear()).toBe(true);
    expect(dateio('2000').isLeapYear()).toBe(true);
    expect(dateio('1900').isLeapYear()).toBe(false);
    expect(dateio('2016').isLeapYear()).toBe(true);
    expect(dateio('1996-05-4 10:43:22').isLeapYear()).toBe(true);
    expect(dateio('1997-05-4 10:43:22').isLeapYear()).toBe(false);
    expect(dateio(831139200000).isLeapYear()).toBe(true);
  });
});
