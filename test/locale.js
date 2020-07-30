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
  expect(dateio('2018-4-28').format('Y-Mo-D W, AH:I')).toBe('2018-四-28 六, 凌晨00:00');
  expect(dateio('2018-4-28 15:10:44').format('Y-mo-D W, AH:I')).toBe('2018-4-28 六, 下午15:10');
  expect(dateio.locale()).toEqual({
    months: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
    monthsShort: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    meridiem: ['凌晨', '上午', '下午', '晚上'],
  });

  dateio.locale({
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    meridiem: ['before dawn', 'noon', 'afternoon', 'evening'],
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  });
  expect(dateio('2018-4-28').format('Y-Mo-D W, H:I, a')).toBe('2018-April-28 Saturday, 00:00, before dawn');
  expect(dateio('2018-4-28 15:10:44').format('Y-mo-D W, H:I, a')).toBe('2018-Apr-28 Saturday, 15:10, afternoon');
  expect(dateio.locale()).toEqual({
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    meridiem: ['before dawn', 'noon', 'afternoon', 'evening'],
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  });

  dateio.locale({
    meridiem: ['a.m.', 'p.m.'],
  });
  expect(dateio('2018-4-28').format('Y-Mo-D W, H:I, a')).toBe('2018-April-28 Saturday, 00:00, a.m.');
  expect(dateio('2018-4-28 15:10:44').format('Y-mo-D W, H:I, a')).toBe('2018-Apr-28 Saturday, 15:10, p.m.');
  expect(dateio.locale()).toEqual({
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    meridiem: ['a.m.', 'p.m.'],
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  });
});

test('Change meridiem with function', () => {
  dateio.locale({
    meridiem(h, i) {
      if (h >= 0 && h < 5) return '凌晨';
      if ((h >= 5 && h < 11) || (h === 11 && i <= 30)) return '上午';
      if ((h === 11 && i > 30) || (h === 12 && i <= 30)) return '中午';
      if ((h === 12 && i > 30) || (h > 12 && h < 19)) return '下午';
      return '晚上';
    },
  });
  expect(dateio().set('h', 1).a).toBe('凌晨');
  expect(dateio().set('h', 4, 59).a).toBe('凌晨');
  expect(dateio().set('h', 5).a).toBe('上午');
  expect(dateio().set('h', 11, 10).a).toBe('上午');
  expect(dateio().set('h', 11, 30).a).toBe('上午');
  expect(dateio().set('h', 11, 31).a).toBe('中午');
  expect(dateio().set('h', 12, 30).a).toBe('中午');
  expect(dateio().set('h', 12, 31).a).toBe('下午');
  expect(dateio().set('h', 18, 59, 59, 999).a).toBe('下午');
  expect(dateio().set('h', 19, 0).a).toBe('晚上');
});
