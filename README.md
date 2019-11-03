# dateio

　　这是一个轻量级、无依赖的日期处理类库，用于日期的取值、格式化显示及计算等，主要针对于小程序这种对体积有一定限制的环境使用，当然也可以用于其它支持ES6语法的环境。

　　API参考了 `moment.js` 和 `day.js`，但是省去了很多平时用不到或很少使用的API，只保留最有用的一些功能（会根据需要增加）。这样也大幅减小了体积。并且为了调用方便，统一`set`和`get`的调用方式，精简了API的书写。

# 安装

```javascript
npm install dateio --save
```

# APIs

　　dateio.js为Date对象创建了一个包装器，称为DateIO对象。DateIO对象又被dateio包装为一个函数，使得传入一个DateIO对象时返回它的新实例。

## 解析

### 构造器 `dateio(input?: string | number | array | Date | DateIO)`

不带参数调用时将返回带有当前日期和时间的`DateIO`对象。

```javascript
dateio();
```

#### 日期字符串

```javascript
dateio('2019-10-20 15:20:45');
```

#### 日期数组

```javascript
dateio([2019, 10, 20, 15, 20, 45]);
```

#### 原生JS Date对象

```javascript
dateio(new Date(2019, 10, 20));
```

#### Unix时间戳(毫秒)

```javascript
dateio(1568781876406);
```

### Clone `.clone()` 或 `dateio(original: DateIO)`
复制当前对象，并返回`DateIO`的新实例。

```javascript
dateio().clone();
dateio(dateio('2019-10-20')); // 将DateIO对象传递给构造函数
```

## 取值/赋值

### 年 `.Y()` 或 `.y(input?: number | numbers)`
取得/设置日期的哪一年。

**注：**赋值行为与原生Date的`setFullYear`保持一致，即可以用多个数值表示分别设置年、月、日，不同的是月份是从1开始。下同。

```javascript
dateio().Y(); // 2019
dateio().y(); // 2019
dateio().y(2000);
dateio().y(2000, 11, 15);
```

### 月 `.M()` 或 `.m(input?: number | numbers)`
取得/设置日期的哪一月，从更符合日常习惯的1开始。大写返回有前导0的字符串格式的月份，小写返回数值型，下同。

```javascript
dateio().M(); // '05'
dateio().m(); // 5
dateio().m(10);
dateio().m(10, 12);
```

### 日 `.D()` 或 `.d(input?: number)`
取得/设置日期的哪一天。

```javascript
dateio().D(); // '08'
dateio().d(); // 8
dateio().d(15);
```

### 星期 `.W()` 或 `.w()`
取得日期的星期几。

```javascript
dateio().W(); // 星期一
dateio().w(); // 1
```

### 时 `.H()` 或 `.h(input?: number | numbers)`
取得/设置时间的小时数，24小时制。可以用多个数值表示分别设置时、分、秒、毫秒，下同。

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
```

### 上下午 `.A()` 或 `.a()`
取得时间的上下午。

```javascript
dateio().A(); // 上午
dateio().a(); // 上午
```

### Unix毫秒时间戳 `.valueOf()` 或 `.u(input?: number)`
取得/设置时间的Unix毫秒时间戳。

```javascript
dateio().valueOf(); // 1571553140345
dateio().u(); // 1571553140345
dateio().u(1571553140345);
```

### Unix秒时间戳 `.U(input?: number)`
取得/设置时间的Unix秒时间戳。

```javascript
dateio().U(); // 1571553140
dateio().U(1571553140);
```

### 取值 `.get(unit: string)`
返回`DateIO`对象中相应的数值，对应上面的各种取值。

```javascript
dateio().get('m');
dateio().get('h');
```

### 赋值 `.set(unit: string, value: number)`
返回被赋值后的DateIO对象。

```javascript
dateio().set('d', 1);
dateio().set('m', 3);
dateio().set('s', 30);
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
对日期进行+-运算，默认精确到毫秒，可传小数。
- input: `7d`, `-1m`, `10y`, `5.5h`等或数字。
- unit: `y`, `m`, `d`, `w`, `h`, `i`, `s`, `ms`。

```javascript
dateio().add(7, 'd');
dateio().add('7d');
```

### 减法 `.subtract(value: number, unit?: string)`
参数同加法，也可以用加法，传入负数。

```javascript
dateio().subtract(7, 'y');
dateio().subtract('7y');
dateio().add(-7, 'd');
dateio().add('-7d');
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
| `Y` 或 `y` | 2018            | 年份                |
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
| `u`        | 0-1571136267050 | 毫秒时间戳 (unix格式) |
| `U`        | 0-1542759768    | 秒时间戳 (unix格式)  |

### 比较 `.diff(input: Date like | DateIO, unit?: string, float?: boolean)`
返回两个日期的差值，精确到毫秒

```javascript
const date1 = dateio('2019-10-20');
const date2 = dateio('2018-06-05');
date1.diff(date2); // 43372800000
date1.diff(date2, 'm'); // 16
date1.diff(date2, 'm', true); // 16.73333333333333
date1.diff(date2, 'd'); // 502
```

### 计算某月有几天 `.daysInMonth()`

```javascript
dateio('2019-10-20').daysInMonth(); // 31
```

### 转换成Date对象 `.toDate()`

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
比较两个同格式的日期是否相同，默认精确到毫秒。

```javascript
dateio().isSame(dateio()); // true
dateio().isSame(new Date, 'y'); // true
dateio().isSame(1571587652864, 'm');
```

## 国际化

### 自定义语言

```javascript
dateio().i18n({
  apm: ['上午', '下午'],
  weekdays: ['日', '一', '二', '三', '四', '五', '六'],
});
```
