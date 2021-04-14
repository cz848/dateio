import moment from 'moment';
import MockDate from 'mockdate';
import dateio from '../index';

const zeroFill = (number, targetLength = 2) => `00${number}`.slice(-targetLength);

beforeEach(() => {
  MockDate.set(new Date());
});

afterEach(() => {
  MockDate.reset();
});

global.console.warn = () => {}; // for moment.js

test('Get Year', () => {
  expect(dateio().get('y')).toBe(moment().get('year'));
  expect(dateio().get('Y')).toBe(zeroFill(moment().get('year'), 4));
  expect(dateio().y()).toBe(moment().year());
  expect(dateio(1970, 3, 4).Y()).toBe(zeroFill(moment('1970-3-4').year(), 4));
});

test('Get Month', () => {
  expect(dateio().get('m')).toBe(moment().get('month') + 1);
  expect(dateio().get('M')).toBe(zeroFill(moment().get('month') + 1));
  expect(dateio().m()).toBe(moment().month() + 1);
  expect(dateio().M()).toBe(zeroFill(moment().month() + 1));
});

test('Get Day of Week', () => {
  expect(dateio().get('w')).toBe(moment().get('day'));
  expect(dateio().get('W')).toBe(moment().locale('zh-cn').format('dd'));
  expect(dateio().w()).toBe(moment().day());
  expect(dateio().W()).toBe(moment().locale('zh-cn').format('dd'));
});

test('Get Date', () => {
  expect(dateio().get('d')).toBe(moment().get('date'));
  expect(dateio().get('D')).toBe(zeroFill(moment().get('date')));
  expect(dateio().d()).toBe(moment().date());
  expect(dateio().D()).toBe(zeroFill(moment().date()));
});

test('Get Hour', () => {
  expect(dateio().get('h')).toBe(moment().get('hour'));
  expect(dateio().get('H')).toBe(zeroFill(moment().get('hour')));
  expect(dateio().h()).toBe(moment().hour());
  expect(dateio().H()).toBe(zeroFill(moment().hour()));
});

test('Get Minute', () => {
  expect(dateio().get('i')).toBe(moment().get('minute'));
  expect(dateio().get('I')).toBe(zeroFill(moment().get('minute')));
  expect(dateio().i()).toBe(moment().minute());
  expect(dateio().I()).toBe(zeroFill(moment().minute()));
});

test('Get Second', () => {
  expect(dateio().get('s')).toBe(moment().get('second'));
  expect(dateio().get('S')).toBe(zeroFill(moment().get('second')));
  expect(dateio().s()).toBe(moment().second());
  expect(dateio().S()).toBe(zeroFill(moment().second()));
});

test('Get Millisecond', () => {
  expect(dateio().get('ms')).toBe(moment().get('millisecond'));
  expect(dateio().get('MS')).toBe(zeroFill(moment().get('millisecond'), 3));
  expect(dateio().ms()).toBe(moment().millisecond());
  expect(dateio().MS()).toBe(zeroFill(moment().millisecond(), 3));
});

test('Get Unix timestamp', () => {
  const d = '2019-10-5 6:5:4:321';
  expect(dateio().get('u')).toBe(moment().valueOf());
  expect(dateio(d).get('U')).toBe(moment(d).unix());
  expect(dateio().u()).toBe(moment().valueOf());
  expect(dateio(d).U()).toBe(moment(d).unix());
  expect(dateio().u(0).valueOf()).toBe(moment(0).valueOf());
  expect(dateio().u(1).valueOf()).toBe(moment(1).valueOf());
  expect(dateio().U(1546).valueOf()).toBe(moment.unix(1546).valueOf());
  expect(dateio().U(1546345).valueOf()).toBe(dateio(1546345000).U() * 1000);
  expect(dateio.U(154633).valueOf()).toBe(moment.unix(154633).valueOf());
  expect(dateio.U(1546345789).valueOf()).toBe(dateio(1546345789000).U() * 1000);
});

test('Get unknown things', () => {
  expect(dateio().get('Unknown String')).toBeUndefined();
  expect(dateio().get('')).toBeUndefined();
  expect(dateio().get(undefined)).toBeUndefined();
  expect(dateio().get(null)).toBeUndefined();
  expect(dateio().get(false)).toBeUndefined();
  expect(dateio().get(NaN)).toBeUndefined();
  expect(dateio().get()).toBeUndefined();
  expect(dateio().get(0)).toBeUndefined();
});

test('Set Year', () => {
  expect(dateio().set('y', 2008).valueOf()).toBe(moment().set('year', 2008).valueOf());
  expect(dateio().y(0).valueOf()).toBe(moment().year(0).valueOf());
  expect(dateio().y(2000).valueOf()).toBe(moment().year(2000).valueOf());
  expect(dateio().y(2000, 4, 5).valueOf()).toBe(new Date().setFullYear(2000, 3, 5));
});

test('Set Month', () => {
  expect(dateio().set('m', 11).valueOf()).toBe(moment().set('month', 10).valueOf());
  expect(dateio().m(1).valueOf()).toBe(moment().month(0).valueOf());
  expect(dateio().m(2).valueOf()).toBe(new Date().setMonth(1));
  expect(dateio().m(11, 31).valueOf()).toBe(new Date().setMonth(10, 31));
});

test('Set Day', () => {
  expect(dateio().set('d', 30).valueOf()).toBe(moment().set('date', 30).valueOf());
  expect(dateio().d(0).valueOf()).toBe(moment().date(0).valueOf());
  expect(dateio().d(1).valueOf()).toBe(moment().date(1).valueOf());
});

test('Set Week', () => {
  expect(dateio().set('w', 3).valueOf()).toBe(moment().set('day', 3).valueOf());
  expect(dateio().w(0).valueOf()).toBe(moment().day(0).valueOf());
  expect(dateio().w(6).valueOf()).toBe(moment().day(6).valueOf());
  expect(dateio().w(-7).valueOf()).toBe(moment().day(-7).valueOf());
  expect(dateio().w(7).valueOf()).toBe(moment().day(7).valueOf());
});

test('Set Hour', () => {
  expect(dateio().set('h', 6).valueOf()).toBe(moment().set('hour', 6).valueOf());
  expect(dateio().h(0).valueOf()).toBe(moment().hour(0).valueOf());
  expect(dateio().h(1).valueOf()).toBe(moment().hour(1).valueOf());
  expect(dateio().h(2, 10, 10, 123).valueOf()).toBe(new Date().setHours(2, 10, 10, 123));
});

test('Set Minute', () => {
  expect(dateio().set('i', 59).valueOf()).toBe(moment().set('minute', 59).valueOf());
  expect(dateio().i(0).valueOf()).toBe(moment().minute(0).valueOf());
  expect(dateio().i(1).valueOf()).toBe(moment().minute(1).valueOf());
  expect(dateio().i(10, 10, 123).valueOf()).toBe(new Date().setMinutes(10, 10, 123));
});

test('Set Second', () => {
  expect(dateio().set('s', 59).valueOf()).toBe(moment().set('second', 59).valueOf());
  expect(dateio().s(0).valueOf()).toBe(moment().second(0).valueOf());
  expect(dateio().s(1).valueOf()).toBe(moment().second(1).valueOf());
  expect(dateio().s(10, 123).valueOf()).toBe(new Date().setSeconds(10, 123));
});

test('Set Millisecond', () => {
  expect(dateio().set('ms', 999).valueOf()).toBe(moment().set('millisecond', 999).valueOf());
  expect(dateio().ms(0).valueOf()).toBe(moment().millisecond(0).valueOf());
  expect(dateio().ms(1).valueOf()).toBe(moment().millisecond(1).valueOf());
  expect(dateio().ms(1573908997062).valueOf()).toBe(moment().millisecond(1573908997062).valueOf());
  expect(dateio().ms(1573908997062).valueOf()).toBe(dateio().ms(0) + dateio().u(1573908997062));
});

test('Set Month and Year in last day of month', () => {
  const origin = dateio('2011-07-31T14:48:00.000Z');
  const setMonth = origin.clone().set('m', 1);
  expect(setMonth.m()).toBe(1);
  expect(origin.d()).toBe(31);
  expect(setMonth.d()).toBe(31);
  const origin2 = dateio('2000-02-29T10:21:30.000Z');
  const setYear = origin2.clone().set('y', 2001);
  expect(setYear.m()).toBe(3);
  expect(origin2.d()).toBe(29);
  expect(setYear.d()).toBe(1);
});

test('Set unknown things', () => {
  expect(dateio().set('Unknown String', 1).valueOf()).toBe(moment().set('Unknown String', 1).valueOf());
  expect(dateio().set('', 1).valueOf()).toBe(moment().set('', 1).valueOf());
  expect(dateio().set().valueOf()).toBe(moment().set().valueOf());
  expect(dateio().set(null).valueOf()).toBe(moment().set(null).valueOf());
  expect(dateio().set(undefined).valueOf()).toBe(moment().set(undefined).valueOf());
  expect(dateio().set(false).valueOf()).toBe(moment().set(false).valueOf());
  expect(dateio().set(NaN).valueOf()).toBe(moment().set(NaN).valueOf());
  expect(dateio().set('D', 1).valueOf()).toBe(moment().set('x', 1).valueOf());
  expect(dateio().set('d', null).valueOf()).toBe(moment().set('D', null).valueOf());
  expect(dateio().set('d', undefined).valueOf()).toBe(moment().set('D', undefined).valueOf());
  expect(dateio().set('d', false).valueOf()).toBe(moment().set('D', false).valueOf());
  expect(dateio().set('d', NaN).valueOf()).toBe(moment().set('D', NaN).valueOf());
  expect(dateio().set('d', '').valueOf()).toBe(moment().set('D', '').valueOf());
  expect(dateio().set('d', 'unknown').valueOf()).toBe(moment().set('D', 'unknown').valueOf());
  expect(dateio().set('d', '0').valueOf()).toBe(moment().set('D', '0').valueOf());
  expect(dateio().set('d', 0).valueOf()).toBe(moment().set('D', 0).valueOf());

  expect(dateio().y('').valueOf()).toBe(moment().year('').valueOf());
  expect(dateio().y('unknown').valueOf()).toBe(moment().year('unknown').valueOf());
  expect(dateio().y(null).valueOf()).toBe(moment().year(null).valueOf());
  expect(dateio().y(undefined).valueOf()).toBe(moment().year(undefined).valueOf());
  expect(dateio().y(false).valueOf()).toBe(moment().year(false).valueOf());
  expect(dateio().y(NaN).valueOf()).toBe(moment().year(NaN).valueOf());
});

test('Immutable Set', () => {
  const dateioA = dateio();
  const dateioB = dateioA.clone().set('y', 2011);
  const momentA = moment();
  const momentB = momentA.set('y', 2011);
  expect(dateioA.valueOf()).not.toBe(dateioB.valueOf());
  expect(dateioB.valueOf()).toBe(momentB.valueOf());
});
