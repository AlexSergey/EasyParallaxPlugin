var utils = require('./core/utils');

var EasyParallax = (function() {
    //body - document.body
    var body;
    //mainClass -
    var mainClass;
    var customScroll;
    var main;
    var startScroll = false;
    var scrolling;
    var ctmScroll;
    var customScrollContainer;
    var customScrollProgress;
    var customScrollBar;
    var pagingClass;
    var onClick = false;
    var keyboardActive = false;
    var animationOnScroll;




    var ctmScrollProgress;
    var ctmScrollBar;
    var dragLimit;
    var paging;

    var duration;

    var animation;

    /**
    *
    * */
    var buildCustomScroll = function() {
        var _this = this;
        Draggable.create(customScrollProgress, {
            type: 'x',
            bounds: ctmScroll,
            onDrag:function() {
                var tnProgress  = (Math.round( (this.x / dragLimit) * 1000)) /1000,
                    scrollCount = (duration * main.clientHeight) * tnProgress;

                animationOnScroll = false;

                _this.timeline.progress(tnProgress);

                TweenLite.set(ctmScrollBar, {
                    width: this.x + 10
                });

                TweenLite.set(window, {
                    scrollTo:{
                        y:scrollCount
                    }
                });
            },
            onPress:function() {
                _this.timeline.pause();
            },
            onDragEnd: function() {
                animationOnScroll = true;
            }
        });
    };

    var buildFakeScroll = function() {
        utils.css(body, 'height', ((duration * body.clientHeight) + body.clientHeight) + 'px');
    };

    var findElement = function() {
        main = utils.query(document, mainClass);
        if(customScroll) {
            ctmScroll          = utils.find(main, customScrollContainer)[0];
            ctmScrollProgress  = utils.find(main, customScrollProgress)[0];
            ctmScrollBar       = utils.find(main, customScrollBar)[0];

            if (ctmScroll && ctmScrollProgress) {
                dragLimit          = ctmScroll.clientWidth - ctmScrollProgress.clientWidth;
                buildCustomScroll.call(this);
            }
        }
        paging = utils.find(main, pagingClass)[0];
    };

    var scrollTopBeforeUnload = function() {
        window.scrollTo(0,0);
    };

    var animationUpdate = function() {
        if (!onClick && keyboardActive === false) {
            utils.trigger(body, 'scrollEmulate');
        }

        var xPos = this.timeline.progress() * dragLimit;

        if (ctmScrollProgress) {
            TweenLite.set(ctmScrollProgress, {x:xPos});
        }
        if (ctmScrollBar) {
            TweenLite.set(ctmScrollBar, {width:xPos+10});
        }
    };

    var fakeScrollUpdate = function() {
        var tnProgress = this.timeline.progress(),
            scroll     = ((duration * main.clientHeight) * tnProgress);

        TweenLite.set(window, {
            scrollTo: {
                y: scroll
            }
        });
    };

    var mousescroll = function(e) {
        startScroll = true;
        var delta = e.wheelDelta;
        if(delta > 0){
            if (startScroll) {
                startScroll = false;
                this.timeline.reverse();
            }
        } else {
            if (startScroll) {
                startScroll = false;
                this.timeline.play();
            }
        }
    };

    var mouseStop = function() {
        clearTimeout(scrolling);
        scrolling = setTimeout(function() {
            this.timeline.pause();
            startScroll = true;
        }.bind(this), 50);
    };

    var keyDown = function(e) {
        if (e.keyCode === 40 || e.keyCode === 38) {
            keyboardActive = true;
            if (animationOnScroll) {
                this.timeline.play();
            }
        }
    };

    var keyUp = function(e) {
        if (e.keyCode === 40 || e.keyCode === 38) {
            keyboardActive = false;
            this.timeline.pause();
        }
    };

    var paginationBind = function(e) {
        e.preventDefault();

        if (e.target.nodeName === 'A') {
            var el    = e.target,
                label = el.getAttribute('data-label');
            this.goTo(label);
        }
    };

    var mousedown = function() {
        onClick = true;
    };

    var mouseup = function() {
        onClick = false;
    };

    /**
    * If mouse has been clicked and you are scrolling
    * If you are scrolling from scrollbar drag
    * */
    var scrollFromScrollbar = function() {
        if (onClick) {
            if (animationOnScroll) {
                var scrollTop            = utils.scrollTop(),
                    docHeight            = body.clientHeight,
                    winHeight            = main.clientHeight,
                    scrollPercent        = (scrollTop) / (docHeight - winHeight);

                this.timeline.progress(scrollPercent).pause();
            }
        }
    };

    var bindEvents = function() {
        utils.on(window, 'beforeunload', scrollTopBeforeUnload);

        utils.on(paging, 'click', paginationBind, this);

        utils.on(window, 'keydown', keyDown, this);

        utils.on(window, 'keyup', keyUp, this);

        utils.on(window, 'mousedown', mousedown);

        utils.on(window, 'mouseup', mouseup);

        utils.on(window, 'scroll', scrollFromScrollbar, this);

        utils.on(document.body, 'scrollEmulate', fakeScrollUpdate.bind(this));

        utils.on(document.body, 'mousewheel', mouseStop, this);

        utils.on(main, 'mousewheel', mousescroll, this);
    };


    function EasyParallax(options) {
        body                  = document.body;
        mainClass             = options.mainContainer         || '#wrap';
        customScroll          = options.customScroll          || false;
        customScrollContainer = options.customScrollContainer || '.ctm-scroll-cont';
        customScrollProgress  = options.customScrollElem      || '.ctm-scroll-el';
        customScrollBar       = options.customScrollBar       || '.ctm-scroll-bar';
        pagingClass           = options.pagination            || '.ctm-scroll-bar';

        animation = options.animation || function() {};

        animationOnScroll     = true;

        this.timeline = new TimelineMax({
            paused : true,
            onUpdate: animationUpdate.bind(this)
        });

        findElement.call(this);

        animation.call(this);

        duration = this.timeline.totalDuration();

        buildFakeScroll.call(this);
        bindEvents.call(this);
    }

    EasyParallax.prototype = {
        goTo: function(label) {
            this.timeline.tweenTo(label, {onUpdate: function() {
                utils.trigger(body, 'scrollEmulate');
            }.bind(this)});
        }
    };

    return EasyParallax;
}());

global.EasyParallax = EasyParallax;