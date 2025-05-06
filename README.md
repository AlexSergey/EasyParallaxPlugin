EasyParallaxPlugin 5.0
======================
This is very easy and powerful parallax-scroller plugin. It has based on GSAP.

- [Example](http://natrube.net/easy_parallax/index.html)

## How to use

```js
import EasyParallax from 'gsap-easyparallax';

var easyParallax = new EasyParallax({
    mainContainer         : '#site',
    customScroll          : true,
    customScrollContainer : '#drag-container',
    customScrollProgress  : '.drag-elem',
    customScrollBar       : '.drag-bar',
    pagingClass: '.paging',
    animation: function() {
        //GSAP Time Line Animation
    }
});
```
