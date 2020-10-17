let { libraryCompiler } = require('@rockpack/compiler');

libraryCompiler({
  name: 'EasyParallax',
  cjs: {
    src: './src',
    dist: './lib/cjs'
  },
  esm: {
    src: './src',
    dist: './lib/esm'
  }
});
