import MockDate from 'mockdate';
// import moment from 'moment';
import dateio from '../index';

beforeEach(() => {
  MockDate.set(new Date());
});

afterEach(() => {
  MockDate.reset();
});

test('Uses i18n locale through constructor', () => {
  const format = 'Y-M-D W, AH:I';
  expect(dateio('2018-4-28').format(format)).toBe('2018-04-28 六, 凌晨00:00');
  expect(dateio('2018-4-28 15:10:44').format(format)).toBe('2018-04-28 六, 下午15:10');
  expect(dateio.locale()).toEqual({
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    interval: ['凌晨', '上午', '下午', '晚上'],
  });

  const format2 = 'Y-M-D W, H:I, a';
  dateio.locale({
    interval: ['before dawn', 'noon', 'afternoon', 'evening'],
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  });
  expect(dateio('2018-4-28').format(format2)).toBe('2018-04-28 Saturday, 00:00, before dawn');
  expect(dateio('2018-4-28 15:10:44').format(format2)).toBe('2018-04-28 Saturday, 15:10, afternoon');
  expect(dateio.locale()).toEqual({
    interval: ['before dawn', 'noon', 'afternoon', 'evening'],
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  });

  dateio.locale({
    interval: ['a.m.', 'p.m.'],
  });
  expect(dateio('2018-4-28').format(format2)).toBe('2018-04-28 Saturday, 00:00, a.m.');
  expect(dateio('2018-4-28 15:10:44').format(format2)).toBe('2018-04-28 Saturday, 15:10, p.m.');
  expect(dateio.locale()).toEqual({
    interval: ['a.m.', 'p.m.'],
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  });
});
