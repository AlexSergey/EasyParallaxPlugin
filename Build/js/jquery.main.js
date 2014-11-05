(function($) {
    $(function(){
        var EasyParallax = function(){
            var vi = {};
            vi.query = function(elem, className) {
                return elem.querySelector(className);
            }
            vi.find = function(elem, className) {
                var collection = elem.querySelectorAll(className);
                return Array.prototype.slice.call(collection);
            }
            vi.css = function(elem, style, prop) {
                elem.style[style] = prop;
            }
            vi.trigger = function(elem, eventName) {
                var event = document.createEvent('Event');
                event.initEvent(eventName, true, true);
                elem.dispatchEvent(event);
            }
            vi.scrollTop = function() {
                if(typeof pageYOffset!= 'undefined'){
                    return pageYOffset;
                }
                else{
                    var body     = document.body,
                        document = document.documentElement;

                    document     = (document.clientHeight)? document: body;

                    return document.scrollTop;
                }
            }

            var plugin = {
                init: function(options) {
                    this.body                  = document.body;
                    this.mainClass             = options.mainContainer         || '#wrap';
                    this.customScroll          = options.customScroll          || false;
                    this.customScrollContainer = options.customScrollContainer || '.ctm-scroll-cont';
                    this.customScrollProgress  = options.customScrollElem      || '.ctm-scroll-el';
                    this.customScrollBar       = options.customScrollBar       || '.ctm-scroll-bar';
                    this.pagingClass           = options.pagination            || '.ctm-scroll-bar';
                    this.keyboard              = options.keyboard              || true;
                    this.keyPlay               = options.keyPlay               || 39;
                    this.keyReverse            = options.keyReverse            || 37;

                    this.animationOnScroll     = true;

                    this.timeline = new TimelineMax({paused : true, onUpdate: this.animationUpdate.bind(this)});
                    this.animation();
                    this.duration = this.timeline.totalDuration();
                    this.buildNativeScroll();
                    this.findElement();
                    this.pagination();
                    this.bindEvents();
                },
                animation: function() {
                    Animation.call(this);
                },
                findElement: function() {
                    this.main = vi.query(document, this.mainClass);
                    if(this.customScroll) {
                        this.ctmScroll          = vi.find(this.main, this.customScrollContainer)[0];
                        this.ctmScrollProgress  = vi.find(this.main, this.customScrollProgress)[0];
                        this.ctmScrollBar       = vi.find(this.main, this.customScrollBar)[0];
                        this.dragLimit          = this.ctmScroll.clientWidth - this.ctmScrollProgress.clientWidth;
                        this.buildCustomScroll();
                    }
                    this.paging = vi.find(this.main, this.pagingClass)[0];
                },
                buildNativeScroll: function() {
                    vi.css(this.body, 'height', this.duration * this.body.clientHeight + 'px');
                },
                buildCustomScroll: function() {
                    var _this = this;
                    Draggable.create(this.customScrollProgress, {
                        type:'x',
                        bounds:this.ctmScroll,
                        onDrag:function() {
                            var tnProgress  = (Math.round( (this.x / _this.dragLimit) * 1000)) /1000,
                                scrollCount = (_this.duration * _this.main.clientHeight) * tnProgress;

                            _this.animationOnScroll = false;
                            _this.timeline.progress(tnProgress);
                            TweenLite.set(_this.ctmScrollBar, {width:this.x + 10});
                            TweenLite.set(window, {scrollTo:{y:scrollCount}});
                        },
                        onPress:function() {
                            _this.timeline.pause();
                        },
                        onDragEnd: function() {
                            _this.animationOnScroll = true;
                        }
                    });
                },
                animationUpdate: function() {
                    var xPos = this.timeline.progress() * this.dragLimit;

                    TweenLite.set(this.ctmScrollProgress, {x:xPos});
                    TweenLite.set(this.ctmScrollBar, {width:xPos+10});
                },

                pagination: function() {
                    this.paging.addEventListener('click', function(e) {
                        e.preventDefault();
                        
                        if (e.target.nodeName === 'A') {
                            var el    = e.target,
                                label = el.getAttribute('data-label');
                            this.goTo(label);
                        }
                    }.bind(this))
                },

                goTo: function(label) {
                    this.timeline.tweenTo(label, {onUpdate: function() {
                        vi.trigger(this.body, 'scrollEmulate');
                    }.bind(this)});
                },

                bindEvents: function() {
                    this.body.addEventListener('scrollEmulate', this.fakeScrollUpdate.bind(this));
                    window.addEventListener('scroll', this.scrollUpdate.bind(this));

                    if (this.keyboard) {
                        window.addEventListener('keydown', this.keydown.bind(this));
                        window.addEventListener('keyup', this.keyup.bind(this));
                    }
                },

                fakeScrollUpdate: function() {
                    var tnProgress = ( Math.round( this.timeline.progress() * 1000) ) /1000,
                        scroll     = ((this.duration * this.main.clientHeight) * tnProgress);

                    TweenLite.set(window, {scrollTo: {y: scroll}});
                },

                scrollUpdate: function() {
                    if (this.animationOnScroll) {
                        var scrollTop            = vi.scrollTop(),
                            docHeight            = this.body.clientHeight,
                            winHeight            = this.main.clientHeight,
                            scrollPercent        = (scrollTop) / (docHeight - winHeight),
                            scrollPercentRounded = Math.round(scrollPercent * 100) / 100;

                        this.timeline.progress(scrollPercentRounded).pause();
                    }
                },

                keydown: function(e) {
                    this.animationOnScroll = false;
                    switch (e.keyCode) {
                        case this.keyPlay:
                            this.timeline.play();
                            break;

                        case this.keyReverse:
                            this.timeline.reverse();
                            break;
                    }
                    vi.trigger(this.body, 'scrollEmulate')
                },

                keyup: function() {
                    this.timeline.pause();
                    this.animationOnScroll = true;
                }
            }

            return {
                init: function(options) {
                    return plugin.init(options)
                }
            }
        };

        var easyParallax = EasyParallax();

        easyParallax.init({
            mainContainer         : '#site',
            customScroll          : true,
            customScrollContainer : '#drag-container',
            customScrollElem      : '.drag-elem',
            customScrollBar       : '.drag-bar',
            pagination            : '.paging',
            keyboard              : true,
            keyPlay               : 39,   //keycode button ->
            keyReverse            : 37,   //keycode button <-
        });
    });


})(jQuery);