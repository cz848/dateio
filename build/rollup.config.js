const babel = require('rollup-plugin-babel');
const { terser } = require('rollup-plugin-terser');

module.exports = config => {
  const { input, fileName, name } = config;
  return {
    input: {
      input,
      external: [
        'dateio',
      ],
      plugins: [
        babel(),
        terser(),
      ],
    },
    output: {
      file: fileName,
      format: 'umd',
      name: name || 'dateio',
      globals: {
        dateio: 'dateio',
      },
    },
  };
};