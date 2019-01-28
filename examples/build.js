let { compile } = require('../node_modules/rocket-starter');
let { resolve } = require('path');

compile({
    url: './',
    src: resolve(__dirname, 'src/example.js'),
    html: [
        {
            template:  resolve(__dirname, 'src/index.html')
        }
    ],
    copy: [
        { from: resolve(__dirname, './src/css'), to: './css' },
        { from: resolve(__dirname, './src/fonts'), to: './fonts' },
        { from: resolve(__dirname, './src/images'), to: './images' }
    ]
});