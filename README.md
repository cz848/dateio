# dateio

　　这是一个超轻量级、零依赖的日期处理类库，用于日期的取值、格式化显示及计算等，主要针对于对代码体积有一定限制，同时支持ES6语法的环境。

　　API参考了 `moment.js` 和 `day.js`，但是省去了很多平时用不到或很少使用的API，只保留最有用的一些功能（会根据需要增加）。这样也大幅减小了体积。并且为了调用方便，统一`set`和`get`的调用方式，精简了API的书写。

# 安装

```javascript
npm install dateio
```

# APIs

　　dateio.js为`Date`对象创建了一个包装器，称为`DateIO`对象。`DateIO`对象又被`dateio`包装为一个函数，使得传入一个`DateIO`对象时返回它的新实例。以下方法要么返回具体值，要么返回一个`DateIO`对象以便可以链式调用。

## 解析

### 构造器 `dateio(input?: string | number | array | Date | DateIO)`

返回`DateIO`对象
- 不带参数时返回当前日期和时间的`DateIO`对象
- 带参数时返回传入日期时间的`DateIO`对象

```javascript
dateio();
```

#### 传入日期字符串

```javascript
dateio('2019-10-20 15:20:45');
dateio('2019-10-20T15:20:45Z');
dateio('2020-01-28 10:04:33.555');
```

#### 传入日期数组

```javascript
dateio([2019]);
dateio([2019, 10, 20]);
dateio([2019, 10, 20, 15, 20, 45]);
```

#### 传入原生 JS Date 对象

```javascript
dateio(new Date(2019, 10, 20));
```

#### 传入 Unix 偏移量(毫秒)

```javascript
dateio(1568781876406);
```

### Clone `.clone()` 或 `dateio(original: DateIO)`

复制当前对象，并返回`DateIO`对象的新实例。

```javascript
dateio().clone();
dateio(dateio('2019-10-20')); // 将DateIO对象传递给构造函数
```

## 取值/赋值

### 年 `.Y()` 或 `.y(input?: number | numbers)`

取得/设置日期的年份。
- 不带参数时返回代表的年份
- 带参数时返回被改变日期后的`DateIO`对象。下同。

**注：**赋值行为与原生Date的`setFullYear`保持一致，既可以传入多个参数分别设置年、月、日，不同的是月份是从1开始。下同。

```javascript
dateio().Y(); // 2019
dateio().y(); // 2019
dateio('100').Y(); // 0100
dateio('100').y(); // 100
dateio().y(2000); // 被改变年份后的DateIO对象
dateio().y(2000, 11, 15); // 被改变日期后的DateIO对象
```

### 月 `.M()` 或 `.m(input?: number | numbers)`

取得/设置日期的月份，从更符合日常习惯的1开始。大写返回有前导0的字符串格式的月份，小写返回数值型，下同。

```javascript
dateio().M(); // '05'
dateio().m(); // 5
dateio().m(10);
dateio().m(10, 12);
```

### 日 `.D()` 或 `.d(input?: number)`

取得/设置日期的天数。

```javascript
dateio().D(); // '08'
dateio().d(); // 8
dateio().d(15);
```

### 星期 `.W()` 或 `.w(input?: number)`

取得/设置日期的星期几。其中星期日为 0、星期六为 6。

如果给定的值是 0 到 6，则结果的日期将会在当前（星期日至星期六）的星期；如果超出范围，则它将会冒泡到其他星期。

```javascript
dateio().W(); // 星期一
dateio().w(); // 1
dateio().w(0);
moment().w(-7); // 上个星期日 (0 - 7)
moment().w(7); // 下个星期日 (0 + 7)
moment().w(10); // 下个星期三 (3 + 7)
moment().w(24); // 从现在起第 3 个星期三 (3 + 7 + 7 + 7)
```

### 时 `.H()` 或 `.h(input?: number | numbers)`

取得/设置时间的小时数，24小时制。可以传入多个参数分别设置时、分、秒、毫秒，下同。

```javascript
dateio().H(); // '19'
dateio().h(); // 19
dateio().h(12);
dateio().h(12, 23, 59, 100); // 分别设置时、分、秒、毫秒
```

### 分 `.I()` 或 `.i(input?: number | numbers)`

取得/设置时间的分钟数。

```javascript
dateio().I(); // '55'
dateio().i(); // 55
dateio().i(59);
dateio().i(59, 59);
```

### 秒 `.S()` 或 `.s(input?: number | numbers)`

取得/设置时间的秒数。

```javascript
dateio().S(); // '40'
dateio().s(); // 40
dateio().s(1);
```

### 毫秒 `.MS()` 或 `.ms(input?: number)`

取得/设置时间的毫秒数。

```javascript
dateio().MS(); // '089'
dateio().ms(); // 123
dateio().ms(157);
dateio().ms(576869);
```

### 时间段 `.A()` 或 `.a()`

取得一天的上下午等时间段，默认分为四个时间段，可自定义。

```javascript
dateio().A(); // 上午
dateio().a(); // 晚上
```

### Unix 偏移量(毫秒) `.valueOf()` 或 `.u(input?: number)`

取得/设置时间的 Unix 偏移量(毫秒)。

```javascript
dateio().valueOf(); // 1571553140345
dateio().u(); // 1571553140345
dateio().u(1571553140345);
```

### Unix 时间戳(秒) `.U(input?: number)`

取得/设置时间的Unix秒时间戳。**注：为了更符合实际场景，这里改为四舍五入取值**

```javascript
dateio().U(); // 1571553140
dateio(1571553140545).U(); // 1571553141
dateio().U(1571553140);
```

### 取值 `.get(unit: string)`

返回`DateIO`对象中相应的数值，对应上面的各种取值。

```javascript
dateio().get('m');
dateio().get('h');
dateio().get('y');
dateio().get('Y');
```

### 赋值 `.set(unit: string, value: number)`

返回被改变日期后的`DateIO`对象。

```javascript
dateio().set('d', 1);
dateio().set('m', 3);
dateio().set('s', 30);
dateio().set('y', 2015, 4, 3);
```

## 操作

下面是一个操作`DateIO`对象的例子

```javascript
dateio('2019-10-20')
  .add(1, 'd')
  .subtract(1, 'm')
  .add('-1.5h')
  .toString(); // Fri Sep 20 2019 22:30:00 GMT+0800 (中国标准时间)
```

### 加法 `.add(value: number, unit?: string)`

对日期进行+-运算，默认精确到毫秒，可传小数。年份会被转换到月份，然后四舍五入到最接近的整数月，月份直接四舍五入到最接近的整数月。
- input: `7d`, `-1m`, `10y`, `5.5h`等或数字。
- unit: `y`, `m`, `d`, `w`, `h`, `i`, `s`, `ms`。

```javascript
dateio().add(7, 'd');
dateio().add('7d');
dateio().add('7.5d');
dateio().add('7.33m');
dateio().add('7y');
dateio().add('0.7y') === dateio().add(8, 'm'); // 0.7 * 12 = 8.4 = 8
```

注意，为了使操作 dateio().add('-0.5m') 和 dateio().subtract('0.5m') 等价，-0.5、-1.5、-2.5 等都向下舍入。

### 减法 `.subtract(value: number, unit?: string)`

参数同add，也可以用add，传入负数。可传小数，年份会被转换到月份，然后四舍五入到最接近的整数，月份会直接四舍五入到最接近的整数。

```javascript
dateio().subtract(7, 'y');
dateio().subtract('7y');
dateio().subtract('7.5h');
dateio().add(-7, 'd');
dateio().add('-7d');
dateio().add('-7.5h');
```

### 开始于 `.startOf(unit?: string)`

对日期进行从特定时段开始的操作。

```javascript
dateio().startOf('y'); // '2020-01-01 00:00:00'
dateio().startOf('m'); // '2020-02-01 00:00:00'
dateio().startOf('d'); // '2020-02-14 00:00:00'
dateio().startOf('h'); // '2020-02-14 14:00:00'
```

### 结束于 `.endOf(unit?: string)`

对日期进行结束于特定时段的操作。

```javascript
dateio().endOf('y'); // '2020-12-31 23:59:59'
dateio().endOf('m'); // '2020-02-29 23:59:59'
dateio().endOf('d'); // '2020-02-14 23:59:59'
dateio().endOf('h'); // '2020-02-14 14:59:59'
```

## 显示

### 格式化 `.format(formats?: string)`

```javascript
dateio().format(); // '2019-10-20 08:02:17'
dateio('2019-10-20').format('Y-M-D H:I:S'); // '2019-10-20 00:00:00'
dateio().format('H:i:s a'); // '07:28:30 上午'
```

| 格式化字串   | 输出             | 描述               |
| ---------  | --------------- | -------------------|
| `Y`　　　　 | 2018            | 年份，四位，字符串    |
| `y`　　　　 | 2018            | 年份                |
| `m`        | 1-12            | 月份                |
| `M`        | 01-12           | 月份，带前导0，字符串  |
| `d`        | 1-31            | 日                  |
| `D`        | 01-31           | 日，带前导0，字符串    |
| `w`        | 0-6             | 星期几，从0开始       |
| `W`        | 日-六            | 本地化后的星期几      |
| `h`        | 0-23            | 时                  |
| `H`        | 00-23           | 时，有前导0，字符串    |
| `i`        | 0-59            | 分钟                |
| `I`        | 00-59           | 分钟，有前导0，字符串  |
| `s`        | 0-59            | 秒                  |
| `S`        | 00-59           | 秒，带前导0，字符串    |
| `ms`       | 0-999           | 毫秒                |
| `MS`       | 000-999         | 毫秒，带前导0，字符串  |
| `A` 或 `a` | 凌晨 上午 下午 晚上 | 时间段              |
| `u`        | 0-1571136267050 | unix 偏移量(毫秒)   |
| `U`        | 0-1542759768    | unix 时间戳(秒)     |

### 比较 `.diff(input: Date like | DateIO, unit?: string, isFloat?: boolean)`

返回两个日期的差值，精确到毫秒。支持所有可以被转化为日期的参数。

```javascript
const date1 = dateio('2019-10-20');
const date2 = dateio('2018-06-05');
date1.diff(date2); // 43372800000
date1.diff(date2, 'm'); // 16
date1.diff(date2, 'm', true); // 16.483870967741936
date1.diff(date2, 'd'); // 502
```

### 获取某月有多少天 `.daysInMonth()`

```javascript
dateio('2019-10-20').daysInMonth(); // 31
```

### 转换成Date对象 `.toDate()`

拿到Date对象之后就可以使用原生Date的各种方法了。

```javascript
dateio('2019-10-20').toDate();
```

### 转换成字符串 `.toString()`

```javascript
dateio('2019-10-20').toString(); // Sun Oct 20 2019 00:00:00 GMT+0800 (中国标准时间)
```

### 转换成本地化的字符串 `.toLocaleString()`

```javascript
dateio('2019-10-20').toLocaleString(); // 2019/10/20 上午12:00:00
```

## 查询

### 是否相同 `.isSame(compared: Date like | DateIO, unit?: string)`

比较两个同格式的日期是否相同，默认精确到毫秒。支持所有可以被转化为日期的参数。

```javascript
dateio().isSame(dateio()); // true
dateio().isSame(new Date, 'y'); // true
dateio('2020-1-4').isSame(dateio('2019-1-4'), 'm'); // false
dateio().isSame(1571587652864, 'm');
dateio('2020-2-4 10:04:21').isSame(dateio('2020-2-5 10:04:21'), 'h') // false
```

### 是否为闰年 `.isLeapYear()`

```javascript
dateio().isLeapYear(); // true or false
dateio('2019').isLeapYear(); // false
dateio('2016').isLeapYear(); // true
```

## 国际化

### 全局自定义语言包

```javascript
// 默认语言包
dateio.locale({
  // 时间段，可根据传入数组的长度均分一天中的时间
  interval: ['凌晨', '上午', '下午', '晚上'],
  // 星期
  weekdays: ['日', '一', '二', '三', '四', '五', '六'],
});

// 定义其它语言包
dateio.locale({
  interval: ['a.m.', 'p.m.'],
  weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
});
```
