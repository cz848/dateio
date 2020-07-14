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
  expect(dateio(1970, 3, 4).get('Y')).toBe(zeroFill(moment('1970-3-4').year(), 4));
});

test('Get Month', () => {
  expect(dateio().get('m')).toBe(moment().get('month') + 1);
  expect(dateio().get('M')).toBe(zeroFill(moment().get('month') + 1));
});

test('Get Day of Week', () => {
  expect(dateio().get('w')).toBe(moment().get('day'));
  expect(dateio().get('W')).toBe(moment().locale('zh-cn').format('dd'));
});

test('Get Date', () => {
  expect(dateio().get('d')).toBe(moment().get('date'));
  expect(dateio().get('D')).toBe(zeroFill(moment().get('date')));
});

test('Get Hour', () => {
  expect(dateio().get('h')).toBe(moment().get('hour'));
  expect(dateio().get('H')).toBe(zeroFill(moment().get('hour')));
});

test('Get Minute', () => {
  expect(dateio().get('i')).toBe(moment().get('minute'));
  expect(dateio().get('I')).toBe(zeroFill(moment().get('minute')));
});

test('Get Second', () => {
  expect(dateio().get('s')).toBe(moment().get('second'));
  expect(dateio().get('S')).toBe(zeroFill(moment().get('second')));
});

test('Get Millisecond', () => {
  expect(dateio().get('ms')).toBe(moment().get('millisecond'));
  expect(dateio().get('MS')).toBe(zeroFill(moment().get('millisecond'), 3));
});

test('Get Unix timestamp', () => {
  const d = '2019-10-5 6:5:4:321';
  expect(dateio().get('u')).toBe(moment().valueOf());
  expect(dateio(d).get('U')).toBe(moment(d).unix());
});

test('Get unknown things', () => {
  expect(dateio().get('Unknown String')).toBeUndefined();
  expect(dateio().get('sdf')).toBeUndefined();
  expect(dateio().get('')).toBeUndefined();
  expect(dateio().get(null)).toBeUndefined();
  expect(dateio().get(false)).toBeUndefined();
  expect(dateio().get(undefined)).toBeUndefined();
  expect(dateio().get(NaN)).toBeUndefined();
  expect(dateio().get()).toBeUndefined();
});
