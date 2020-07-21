const rollup = require('rollup');
const config = require('./rollup.config');

const build = async option => {
  const bundle = await rollup.rollup(option.input);
  await bundle.write(option.output);
};

try {
  build(config({
    input: './index.js',
    fileName: './dateio.min.js',
  }));
} catch (e) {
  console.error(e);
}
