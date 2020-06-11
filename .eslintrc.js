module.exports = {
  root: true,
  // 指定解析器的选项
  parserOptions: {
    // eslint的解析器，需要安装对应的包
    parser: 'babel-eslint',
    // 指定es版本
    ecmaVersion: 2019,
    // 使用es模块
    sourceType: 'module',
  },
  extends: [
    'airbnb-base',
    // promise 推荐规则
    'plugin:promise/recommended',
  ],
  settings: {},
  rules: {
    // 要求箭头函数的参数在需要时使用圆括号
    'arrow-parens': ['error', 'as-needed'],
    // 允许函数根据代码分支有不同的return行为
    'consistent-return': 'off',
    // 要求或禁止命名的 function 表达式
    'func-names': ['error', 'as-needed'],
    // 一行最大长度
    'max-len': ['error', 120, 2, {
      ignoreUrls: true,
      ignoreComments: false,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
    // 禁用console
    'no-console': 'off',
    // 禁用debugger
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 禁止对 function 的参数进行重新赋值
    'no-param-reassign': ['error', {
      props: false,
    }],
    // 除for循环外不允许++写法
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    // 强制大括号内换行符的一致性
    'object-curly-newline': ['error', {
      multiline: true,
      consistent: true,
    }],
    // 以下为import模块规则
    // 导入文件是否使用扩展名
    // 'import/extensions': ['error', 'never'],
    // 确保导入的文件/模块可以解析为本地文件系统上的模块(配合settings使用)
    'import/no-unresolved': 'off',
  },
};
