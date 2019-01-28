import utils from './core/utils';
import Draggable from 'gsap/Draggable';
import TimelineMax from 'gsap/TimelineMax';
import TweenLite from 'gsap/TweenLite';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

class EasyParallax {
    constructor(options) {
        TimelineMax.ScrollToPlugin = ScrollToPlugin;
        this._body = document.body;
        this.options = Object.assign({
            mainContainer: '#wrap',
            customScroll: false,
            customScrollContainer: '.ctm-scroll-cont',
            customScrollProgress: '.ctm-scroll-el',
            customScrollBar: '.ctm-scroll-bar',
            pagingClass: '.paging',
            animation: function() {}
        }, options);

        this._animationOnScroll = true;

        this.timeline = new TimelineMax({
            paused : true,
            onUpdate: this._animationUpdate.bind(this)
        });

        this._findElement.call(this);

        this.options.animation.call(this);

        this._duration = this.timeline.totalDuration();

        this._buildFakeScroll.call(this);
        this._bindEvents();
    }

    _bindEvents = () => {
        utils.on(window, 'beforeunload', this._scrollTopBeforeUnload);

        utils.on(this._paging, 'click', this._paginationBind, this);

        utils.on(window, 'keydown', this._keyDown, this);

        utils.on(window, 'keyup', this._keyUp, this);

        utils.on(window, 'mousedown', this._mousedown);

        utils.on(window, 'mouseup', this._mouseup);

        utils.on(window, 'scroll', this._scrollFromScrollbar, this);

        utils.on(this._body, 'scrollEmulate', this._fakeScrollUpdate);

        utils.on(this._body, 'mousewheel', this._mouseStop, this);

        utils.on(this._main, 'mousewheel', this._mousescroll, this);
    };
    /**
     * If mouse has been clicked and you are scrolling
     * If you are scrolling from scrollbar drag
     * */
    _scrollFromScrollbar = () => {
        if (this._onClick) {
            if (this._animationOnScroll) {
                let scrollTop            = utils.scrollTop(),
                    docHeight            = this._body.clientHeight,
                    winHeight            = this._main.clientHeight,
                    scrollPercent        = (scrollTop) / (docHeight - winHeight);

                this.timeline.progress(scrollPercent).pause();
            }
        }
    };

    _mousedown = () => {
        this._onClick = true;
    };

    _mouseup = () => {
        this._onClick = false;
    };

    _paginationBind = e => {
        e.preventDefault();

        if (e.target.nodeName.toLowerCase() === 'a') {
            let el    = e.target,
                label = el.getAttribute('data-label');

            this.goTo(label);
        }
    };

    _keyDown = e => {
        if (e.keyCode === 40 || e.keyCode === 38) {
            this._keyboardActive = true;
            if (this._animationOnScroll) {
                this.timeline.play();
            }
        }
        if (e.keyCode === 33 || e.keyCode === 34 || e.keyCode === 35 || e.keyCode === 36) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    _keyUp = e => {
        if (e.keyCode === 40 || e.keyCode === 38) {
            this._keyboardActive = false;
            this.timeline.pause();
        }
        if (e.keyCode === 33 || e.keyCode === 34 || e.keyCode === 35 || e.keyCode === 36) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    _mousescroll = e => {
        this._startScroll = true;
        let delta = e.wheelDelta;
        e.preventDefault();

        if(delta > 0){
            if (this._startScroll) {
                this._startScroll = false;
                this.timeline.reverse();
            }
        } else {
            if (this._startScroll) {
                this._startScroll = false;
                this.timeline.play();
            }
        }
        let tnProgress = this.timeline.progress(),
            scroll     = ((this._duration * this._main.clientHeight) * tnProgress);

        this._updateNativeScroll(scroll);
    };

    _mouseStop = () => {
        clearTimeout(this._scrolling);
        this._scrolling = setTimeout(() => {
            this.timeline.pause();
            this._startScroll = false;
        }, 50);
    };

    _scrollTopBeforeUnload = () => {
        window.scrollTo(0,0);
    };

    _animationUpdate = () => {
        if (!this._onClick && this._keyboardActive === false) {
            utils.trigger(this._body, 'scrollEmulate');
        }

        let xPos = this.timeline.progress() * this._dragLimit;

        if (this._ctmScrollProgress) {
            TweenLite.set(this._ctmScrollProgress, { x: xPos });
        }
        if (this._ctmScrollBar) {
            TweenLite.set(this._ctmScrollBar, { width: xPos + 10 });
        }
    };

    _fakeScrollUpdate = () => {
        let tnProgress = this.timeline.progress(),
            scroll     = ((this._duration * this._main.clientHeight) * tnProgress);

        TweenLite.set(window, {
            scrollTo: {
                y: scroll
            }
        });
    };

    _buildFakeScroll = () => {
        utils.css(this._body, 'height', ((this._duration * this._body.clientHeight) + this._body.clientHeight) + 'px');
    };

    _findElement = () => {
        this._main = utils.query(document, this.options.mainContainer);

        if(this.options.customScroll) {
            this._ctmScroll          = utils.find(this._main, this.options.customScrollContainer)[0];
            this._ctmScrollProgress  = utils.find(this._main, this.options.customScrollProgress)[0];
            this._ctmScrollBar       = utils.find(this._main, this.options.customScrollBar)[0];

            if (this._ctmScroll && this._ctmScrollProgress) {
                this._dragLimit          = this._ctmScroll.clientWidth - this._ctmScrollProgress.clientWidth;
                this._buildCustomScroll();
            }
        }

        this._paging = utils.find(this._main, this.options.pagingClass)[0];
    };

    _buildCustomScroll = () => {
        var _this = this;

        this._draggable = Draggable.create(this._ctmScrollProgress, {
            type: 'x',
            bounds: this._ctmScroll,
            onDrag: function() {
                let tnProgress  = (Math.round( (this.x / _this._dragLimit) * 1000)) / 1000,
                    scroll = ((_this._duration * _this._main.clientHeight)) * tnProgress;

                _this._animationOnScroll = false;

                _this.timeline.progress(tnProgress);

                TweenLite.set(_this._ctmScrollBar, {
                    width: this.x + 10
                });

                _this._updateNativeScroll(scroll);
            },
            onPress:function() {
                _this.timeline.pause();
            },
            onDragEnd: function() {
                _this._animationOnScroll = true;
            }
        })[0];
    };

    goTo = label => {
        this.timeline.tweenTo(label, {onUpdate: () => {
            utils.trigger(this._body, 'scrollEmulate');
        }});
    };

    _updateNativeScroll = value => {
        setTimeout(() => {
            TweenLite.set(window, {
                scrollTo: {
                    y: value
                }
            });
        }, 50);
    }
}

export default EasyParallax;