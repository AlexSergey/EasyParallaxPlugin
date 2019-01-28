EasyParallaxPlugin 4.0
======================
This is very easy and powerfull parallax-scroller plugin. It has based on Greensock animation system.

- [Example](http://natrube.net/easy_parallax/index.html)

## How to use

```js
import EasyParallax from 'EasyParallaxPlugin';

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
