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
  expect(dateio().toString()).toBe(new Date().toString());
  expect(dateio().valueOf()).toBe(moment().valueOf());
  expect(dateio().$date.toString()).toBe(new Date().toString());
});

describe('Format', () => {
  test('Format no formatStr', () => {
    expect(dateio().format()).toBe(moment().format('YYYY-MM-DD HH:mm:ss'));
  });

  test('Format invalid date', () => {
    expect(+dateio('')).toEqual(+moment(''));
    expect(dateio('otherString').toString()).toBe(new Date('otherString').toString());
    expect(dateio(undefined).toString()).toBe(new Date().toString());
    expect(dateio(null).toString()).toBe(new Date().toString());
    expect(dateio(NaN).toString()).toBe(new Date(NaN).toString());
    expect(dateio(false).toString()).toBe(new Date(false).toString());
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
    expect(dateioA - dateioB).toBe(momentA.diff(momentB));
  });

  test('diff -> Date object', () => {
    const dateString = '2013-02-08';
    const dateioA = dateio();
    const dateioB = new Date(dateString);
    const momentA = moment();
    const momentB = new Date(dateString);
    expect(dateioA - dateioB).toBe(momentA.diff(momentB));
  });
});

describe('Timestamp', () => {
  test('Unix Timestamp (milliseconds)', () => {
    expect(dateio().valueOf()).toBe(moment().valueOf());
    expect(dateio().get('u')).toBe(+moment());
  });

  test('Unix Timestamp (seconds)', () => {
    const d = '2019-10-11T10:13:19.123Z';
    expect(dateio(d).get('U')).toBe(moment(d).unix());
  });
});

test('As Javascript Date -> toDate', () => {
  const base = dateio();
  const momentBase = moment();
  const jsDate = base.$date;
  expect(jsDate).toEqual(momentBase.toDate());
  expect(jsDate).toEqual(new Date());

  jsDate.setFullYear(1970);
  expect(jsDate.toUTCString()).not.toBe(base.toString());
});
