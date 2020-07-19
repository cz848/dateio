import moment from 'moment';
import MockDate from 'mockdate';
import dateio from '../index';

beforeEach(() => {
  MockDate.set(new Date());
});

afterEach(() => {
  MockDate.reset();
});

test('Original methods', () => {
  expect(dateio().toDate()).toEqual(new Date());
  expect(dateio().toString()).toBe(new Date().toString());
  expect(dateio().valueOf()).toBe(moment().valueOf());
});

describe('Format', () => {
  test('Format no formatStr', () => {
    expect(dateio().format()).toBe(moment().format('YYYY-MM-DD HH:mm:ss'));
  });

  test('Format invalid date', () => {
    expect(dateio('').valueOf()).toBe(+new Date());
    expect(dateio('otherString').toString()).toBe(new Date('otherString').toString());
    expect(dateio(undefined).toString()).toBe(new Date().toString());
    expect(dateio(null).toString()).toBe(new Date().toString());
    expect(dateio(NaN).toString()).toBe(new Date().toString());
    expect(dateio(false).toString()).toBe(new Date().toString());
  });

  test('Format Year(y/Y)', () => {
    expect(dateio().format('Y')).toBe(moment().format('YYYY'));
    expect(dateio().format('y')).toBe(moment().format('YYYY'));
  });

  test('Format Month(m/M)', () => {
    expect(dateio().format('m')).toBe(moment().format('M'));
    expect(dateio().format('M')).toBe(moment().format('MM'));
  });

  test('Format Day of Month(d/D)', () => {
    expect(dateio().format('d')).toBe(moment().format('D'));
    expect(dateio().format('D')).toBe(moment().format('DD'));
  });

  test('Format Day of Week(w/W)', () => {
    expect(dateio().format('w')).toBe(moment().format('d'));
    expect(dateio().format('W')).toBe(moment().locale('zh-cn').format('dd'));
  });

  test('Format meridiens(a/A)', () => {
    let time = '2018-05-02 01:10:00';
    expect(dateio(time).format('a')).toBe('凌晨');
    expect(dateio(time).format('A')).toBe('凌晨');

    time = '2018-05-02 8:40:12';
    expect(dateio(time).format('a')).toBe('上午');
    expect(dateio(time).format('A')).toBe('上午');

    time = '2018-05-02 16:40:12';
    expect(dateio(time).format('a')).toBe('下午');
    expect(dateio(time).format('A')).toBe('下午');

    time = '2018-05-02 21:40:12';
    expect(dateio(time).format('a')).toBe('晚上');
    expect(dateio(time).format('A')).toBe('晚上');
  });

  test('Format Hour(h/H)', () => {
    expect(dateio().format('h')).toBe(moment().format('H'));
    expect(dateio().format('H')).toBe(moment().format('HH'));
  });

  test('Format Minute(i/I)', () => {
    expect(dateio().format('i')).toBe(moment().format('m'));
    expect(dateio().format('I')).toBe(moment().format('mm'));
  });

  test('Format Second(s/S)', () => {
    expect(dateio().format('s')).toBe(moment().format('s'));
    expect(dateio().format('S')).toBe(moment().format('ss'));
  });

  test('Format with formatStr', () => {
    const sundayDate = '2000-01-02';
    expect(dateio(sundayDate).format('Y M D w h i s')).toBe(moment(sundayDate).format('YYYY MM DD d H m s'));
    expect(dateio().format('Y-M-D / H:i:s')).toBe(moment().format('YYYY-MM-DD / HH:m:s'));
  });
});

describe('Difference', () => {
  test('diff -> default milliseconds', () => {
    const dateString = '2011-01-01';
    const dateioA = dateio();
    const dateioB = dateio(dateString);
    const momentA = moment();
    const momentB = moment(dateString);
    expect(dateioA.diff(dateioB)).toBe(momentA.diff(momentB));
  });

  test('diff -> none dateio object', () => {
    const dateString = '2013-02-08';
    const dateioA = dateio();
    const dateioB = new Date(dateString);
    const momentA = moment();
    const momentB = new Date(dateString);
    expect(dateioA.diff(dateioB)).toBe(momentA.diff(momentB));
    expect(dateioA.diff(dateString)).toBe(momentA.diff(dateString));
  });

  test('diff -> in seconds, minutes, hours, days, weeks, months, years', () => {
    const dateioA = dateio();
    const dateioB = dateio().add('1000d');
    const dateioC = dateio().subtract('1000d');
    const momentA = moment();
    const momentB = moment().add(1000, 'days');
    const momentC = moment().subtract(1000, 'days');
    const units = ['s', 'i', 'h', 'd', 'w', 'm', 'y'];
    const units2 = ['seconds', 'minutes', 'hours', 'days', 'weeks', 'month', 'year'];
    units.forEach((unit, i) => {
      expect(dateioA.diff(dateioB, unit)).toBe(momentA.diff(momentB, units2[i]));
      expect(dateioA.diff(dateioB, unit, true)).toBe(momentA.diff(momentB, units2[i], true));
      expect(dateioA.diff(dateioC, unit)).toBe(momentA.diff(momentC, units2[i]));
      expect(dateioA.diff(dateioC, unit, true)).toBe(momentA.diff(momentC, units2[i], true));
    });
  });

  test('Month/Year diff', () => {
    const dateioA = dateio('2016-01-15');
    const dateioB = dateio('2016-02-15');
    const dateioC = dateio('2017-01-15');
    const momentA = moment('20160115');
    const momentB = moment('20160215');
    const momentC = moment('20170115');
    const units = ['m', 'y'];
    const units2 = ['month', 'year'];
    units.forEach((unit, i) => {
      expect(dateioA.diff(dateioB, unit) + 0).toBe(momentA.diff(momentB, units2[i]));
      expect(dateioA.diff(dateioB, unit, true)).toBe(momentA.diff(momentB, units2[i], true));
      expect(dateioA.diff(dateioC, unit)).toBe(momentA.diff(momentC, units2[i]));
      expect(dateioA.diff(dateioC, unit, true)).toBe(momentA.diff(momentC, units2[i], true));
    });
    expect(dateio('2018-07-08').diff(dateio('2018-07-08'), 'm')).toEqual(0);
    expect(dateio('2018-09-08').diff(dateio('2018-08-08'), 'm')).toEqual(1);
    expect(dateio('2018-07-08').diff(dateio('2018-08-08'), 'm')).toEqual(-1);
    expect(dateio('2018-01-01').diff(dateio('2018-01-01'), 'm')).toEqual(0);
  });

  test('Unknown string diff', () => {
    expect(dateio().diff('2018-10-11', 'unknownString')).toBe(dateio().diff('2018-10-11', 'ms'));
  });
});

describe('Timestamp', () => {
  test('Unix Timestamp (milliseconds)', () => {
    expect(dateio().valueOf()).toBe(moment().valueOf());
    expect(dateio().u()).toBe(+moment());
  });

  test('Unix Timestamp (seconds)', () => {
    const d = '2019-10-11T10:13:19.123Z';
    expect(dateio(d).U()).toBe(moment(d).unix());
  });
});

test('Days in Month', () => {
  expect(dateio().daysInMonth()).toBe(moment().daysInMonth());
  expect(dateio('2014-01-31').daysInMonth()).toBe(moment('20140131').daysInMonth());
});

test('As Javascript Date -> toDate', () => {
  const base = dateio();
  const momentBase = moment();
  const jsDate = base.toDate();
  expect(jsDate).toEqual(momentBase.toDate());
  expect(jsDate).toEqual(new Date());

  jsDate.setFullYear(1970);
  expect(jsDate.toUTCString()).not.toBe(base.toString());
});
