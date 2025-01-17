let { frontendCompiler } = require('@rockpack/compiler');
let { resolve } = require('path');

frontendCompiler({
    src: resolve(__dirname, 'src/example.js'),
    html: [
        {
            template:  resolve(__dirname, 'src/index.ejs')
        }
    ],
    copy: [
        { from: resolve(__dirname, './src/css'), to: './css' },
        { from: resolve(__dirname, './src/fonts'), to: './fonts' },
        { from: resolve(__dirname, './src/images'), to: './images' }
    ]
}, (finalConfig, p, m, mode) => {
  finalConfig.output.publicPath = mode === 'development' ? '/' : './';
});
