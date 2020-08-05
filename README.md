# dateio

　　这是一个轻量级、无依赖的日期处理类库，用于日期的取值、格式化显示及计算等，主要针对于对体积有一定限制，并且支持ES6语法的环境。

　　API参考了 `moment.js` 和 `day.js`，但是省去了很多平时用不到或很少使用的API，只保留最有用的一些功能（会根据需要增加）。这样也大幅减小了体积。并且为了调用方便，统一`set`和`get`的调用方式，精简了API的书写。

　　此分支只保留`get`与`format`相关方法，去掉所有`set`与操作类方法，适用于日期显示及取值。

# 安装

```javascript
npm install cz848/dateio#get --save
```

# APIs

　　dateio.js为`Date`对象创建了一个包装器，称为`DateIO`对象。`DateIO`对象又被`dateio`包装为一个函数，使得传入一个`DateIO`对象时返回它的新实例。

## 解析

### 构造器 `dateio(input?: String | Number | Array | Date | DateIO)`

返回`DateIO`对象
- 不带参数时返回当前日期和时间的`DateIO`对象
- 带参数时返回传入日期时间的`DateIO`对象

```javascript
dateio();
```

#### 传入日期字符串

```javascript
dateio('2019-10-20');
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

### Clone `dateio(original: DateIO)`

复制当前对象，并返回`DateIO`对象的新实例。

```javascript
dateio(dateio('2019-10-20')); // 将DateIO对象传递给构造函数
```

## 取值 `.get(unit: String)`

返回`DateIO`对象中相应的各种取值。

```javascript
dateio().get('m');
dateio().get('h');
dateio().get('y');
dateio().get('Y');
```
可传的日期单位有：

| 取值/格式化字串| 输出             | 描述               |
| ---------  | --------------- | -------------------|
| `Y`        | '2018'          | 年份字符串           |
| `y`        | 2018            | 年份，数值           |
| `m`        | 1-12            | 月份                |
| `M`        | '01'-'12'       | 月份，带前导0，字符串  |
| `d`        | 1-31            | 日                  |
| `D`        | '01'-'31'       | 日，带前导0，字符串    |
| `w`        | 0-6             | 星期几的索引值，从0开始 |
| `W`        | '日'-'六'        | 本地化后的星期几      |
| `h`        | 0-23            | 时                  |
| `H`        | '00'-'23'       | 时，有前导0，字符串    |
| `i`        | 0-59            | 分钟                |
| `I`        | '00'-'59'       | 分钟，有前导0，字符串  |
| `s`        | 0-59            | 秒                  |
| `S`        | '00'-'59'       | 秒，带前导0，字符串    |
| `ms`       | 0-999           | 毫秒                |
| `MS`       | '000'-'999'     | 毫秒，带前导0，字符串  |
| `A` 或 `a` | 凌晨 上午 下午 晚上 | 时间段              |
| `u`        | 0-1571136267050 | unix 偏移量(毫秒)    |
| `U`        | 0-1542759768    | unix 时间戳(秒)      |

## 显示

### 格式化 `.format(formats?: String)`

以`Y-M-D H:I:S`此类的格式显示日期字串，对应的每个日期单位参考上表。

```javascript
dateio().format(); // '2019-10-20 08:02:17'
dateio('2019-10-20').format('Y-M-D H:I:S'); // '2019-10-20 00:00:00'
dateio().format('H:i:s a'); // '07:28:30 上午'
```

### Unix 偏移量(毫秒) `.valueOf()`

显示日期的 Unix 偏移量(毫秒)。

```javascript
dateio().valueOf(); // 1571553140345
```

### 转换成字符串 `.toString()`

转成字符串形式的日期

```javascript
dateio('2019-10-20').toString(); // Sun Oct 20 2019 00:00:00 GMT+0800 (中国标准时间)
String(dateio('2019-10-20')); // Sun Oct 20 2019 00:00:00 GMT+0800 (中国标准时间)
```
