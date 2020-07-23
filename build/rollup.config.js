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
        terser(),
      ],
    },
    output: {
      file: fileName,
      format: 'es',
      name: name || 'dateio',
      globals: {
        dateio: 'dateio',
      },
    },
  };
};
