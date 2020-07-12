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

describe('StartOf EndOf', () => {
  test('with units', () => {
    const testArr = ['y', 'm', 'd', 'h', 'i', 's', 'ms', 'w'];
    const testArr2 = ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond', 'week'];
    testArr.forEach((d, i) => {
      expect(dateio().startOf(d).valueOf()).toBe(moment().startOf(testArr2[i]).valueOf());
      expect(dateio().endOf(d).valueOf()).toBe(moment().endOf(testArr2[i]).valueOf());
    });
  });

  test('with other string', () => {
    expect(dateio().startOf('otherString').valueOf()).toBe(moment().startOf('otherString').valueOf());
    expect(dateio().endOf('otherString').valueOf()).toBe(moment().endOf('otherString').valueOf());
  });

  test('week', () => {
    const testDate = [undefined, '2019-02-10', '2019-02-11', '2019-02-12', '2019-02-13', '2019-02-14', '2019-02-15', '2019-02-16'];
    testDate.forEach(d => {
      expect(dateio(d).startOf('w').w()).toBe(moment(d).startOf('week').day());
      expect(dateio(d).endOf('w').w()).toBe(moment(d).endOf('week').day());
      expect(dateio(d).startOf('w').d()).toBe(moment(d).startOf('week').date());
      expect(dateio(d).endOf('w').d()).toBe(moment(d).endOf('week').date());
    });
  });
});

describe('Add Subtract', () => {
  test('Add Time days', () => {
    expect(dateio().add('1ms').valueOf()).toBe(moment().add(1, 'ms').valueOf());
    expect(dateio().add('1s').valueOf()).toBe(moment().add(1, 's').valueOf());
    expect(dateio().add('1i').valueOf()).toBe(moment().add(1, 'm').valueOf());
    expect(dateio().add('1h').valueOf()).toBe(moment().add(1, 'h').valueOf());
    expect(dateio().add('1w').valueOf()).toBe(moment().add(1, 'w').valueOf());
    expect(dateio().add('1d').valueOf()).toBe(moment().add(1, 'd').valueOf());
    expect(dateio().add('1m').valueOf()).toBe(moment().add(1, 'M').valueOf());
    expect(dateio().add('1y').valueOf()).toBe(moment().add(1, 'y').valueOf());
    expect(dateio().add(1, 'ms').valueOf()).toBe(moment().add(1, 'ms').valueOf());
    expect(dateio().add(1, 's').valueOf()).toBe(moment().add(1, 's').valueOf());
    expect(dateio().add(1, 'i').valueOf()).toBe(moment().add(1, 'm').valueOf());
    expect(dateio().add(1, 'h').valueOf()).toBe(moment().add(1, 'h').valueOf());
    expect(dateio().add(1, 'w').valueOf()).toBe(moment().add(1, 'w').valueOf());
    expect(dateio().add(1, 'd').valueOf()).toBe(moment().add(1, 'd').valueOf());
    expect(dateio().add(1, 'm').valueOf()).toBe(moment().add(1, 'M').valueOf());
    expect(dateio().add(1, 'y').valueOf()).toBe(moment().add(1, 'y').valueOf());
    expect(dateio('2011-10-30').add(1, 'm').valueOf()).toBe(moment('20111030').add(1, 'months').valueOf());
    expect(dateio('2016-01-28').add(1, 'm').valueOf()).toBe(moment('20160128').add(1, 'months').valueOf());
    expect(dateio('2016-02-28').add(1, 'y').valueOf()).toBe(moment('20160228').add(1, 'year').valueOf());
    expect(dateio().add('2', 'y').valueOf()).toBe(moment().add('2', 'years').valueOf());
  });

  test('Add Time with decimal', () => {
    const d = '2019-10-22 15:42:32.544';
    expect(dateio(d).add(0.4, 'd')).toEqual(dateio(+new Date(d) + 864e5 * 0.4));
    expect(dateio(d).add(0.5, 'd')).toEqual(dateio(+new Date(d) + 864e5 * 0.5));
    expect(dateio(d).add(1.4, 'w')).toEqual(dateio(+new Date(d) + 864e5 * 7 * 1.4));
    expect(dateio(d).add(2.5, 'w')).toEqual(dateio(+new Date(d) + 864e5 * 7 * 2.5));
    expect(dateio(d).add('.45h').valueOf()).toEqual(moment(d).add(0.45, 'h').valueOf());
    expect(dateio(d).add('100.45m').valueOf()).toEqual(moment(d).add(100.45, 'M').valueOf());
    expect(dateio(d).add('13.5y').valueOf()).toEqual(moment(d).add(13.5, 'y').valueOf());
    expect(dateio(d).add('-3.5i').valueOf()).toEqual(moment(d).add(-3.5, 'm').valueOf());
  });

  test('Rejects invalid values', () => {
    const d = dateio('2020-01-28 10:04:33.555');
    const m = moment('2020-01-28 10:04:33.555');
    expect(d.add('sdkf').toString().replace(/ \(.+\)$/, '')).toBe(m.toString());
    expect(d.add('10fx').toString().replace(/ \(.+\)$/, '')).toBe(m.toString());
    expect(d.add(3, 'dkf').toString().replace(/ \(.+\)$/, '')).toBe(m.toString());
    expect(d.add(NaN, 's').toString().replace(/ \(.+\)$/, '')).toBe(m.toString());
    expect(d.add('', 'h').toString().replace(/ \(.+\)$/, '')).toBe(m.toString());
    expect(d.add(0, 'm').toString().replace(/ \(.+\)$/, '')).toBe(m.toString());
    expect(d.add(5000).valueOf()).toBe(m.add(5000, 'ms').valueOf());
  });

  test('Subtract Time days', () => {
    expect(dateio().subtract(1, 'd').valueOf()).toBe(moment().subtract(1, 'days').valueOf());
    expect(dateio().subtract('1h').valueOf()).toBe(moment().subtract(1, 'hours').valueOf());
  });

  test('Subtract Time with decimal', () => {
    const d = '2019-11-12 15:42:32:544';
    expect(dateio(d).subtract(0.4, 'd')).toEqual(dateio(+new Date(d) - 864e5 * 0.4));
    expect(dateio(d).subtract(1.5, 'w')).toEqual(dateio(+new Date(d) - 864e5 * 7 * 1.5));
    expect(dateio(d).subtract(12.5, 'h').valueOf()).toEqual(moment(d).subtract(12.5, 'h').valueOf());
    expect(dateio(d).subtract(3.5, 'm').valueOf()).toEqual(moment(d).subtract(3.5, 'M').valueOf());
    expect(dateio(d).subtract(5.45, 'y').valueOf()).toEqual(moment(d).subtract(5.45, 'y').valueOf());
    expect(dateio(d).subtract('0.33333h').valueOf()).toEqual(moment(d).subtract(0.33333, 'h').valueOf());
  });
});
