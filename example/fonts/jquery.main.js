$(function(){
    $("body").queryLoader2({
        onComplete: initParallax(),
        barColor: "#004b8a",
        backgroundColor: "transparent",
        percentage: true,
        barHeight: 0,
        minimumTime: 100
    });
    function initParallax() {
        //Убиваем прелоадер
        $("#preloader_view").hide(0);
        TweenMax.killTweensOf($("#preloader_view .loading"));

        parallaxModule.init({
            mainBlock   : '#wrapper',
            navigation  : '#nav',
            slides     : '.slides',
            vertical   : false,
            scroll     : '#slider',
            event      : 'complete',
            keyboard   : true,
            keyPlay    : 39,  //keycode button ->
            keyReverse : 37   //keycode button <-
        });
    }
});




var parallaxModule = (function(){
    var plugin = {
        initialize: function(opt){
            this.options = $.extend({
                mainBlock   : '#site',
                navigation  : '#navigation',
                slides      : '.slides',
                vertical    : false,
                scroll      : '#scroll',
                event       : 'event',
                keyboard    : false,
                keyPlay     : 39,  //keycode button ->
                keyReverse  : 37   //keycode button <-
            }, opt);
            this.logic();
        },
        logic: function(){
            this.findElements();
            this.recalculate();
            this.addClassToSction();
            this.mouseScroll();
            this.customScroll();
            this.activeClass();
            this.observer();
            this.navigate();
            this.keyboardBind();
            this.animate();
        },
        findElements: function(){
            this.mainBlock   = $(this.options.mainBlock);
            this.navigation  = $(this.options.navigation);
            this.slides      = $(this.options.slides);
            this.slidesCount = this.slides.length;
            this.vertical    = this.options.vertical;
            this.navElement  = this.navigation.find('a');
            this.scroll      = $(this.options.scroll);
            this.event       = this.options.event;
            this.keyboard    = this.options.keyboard;
            this.keyPlay     = this.options.keyPlay;
            this.keyReverse  = this.options.keyReverse;
            this.$body       = $('body');
            this.window      = $(window);

            this.ScrollTween = new TimelineLite({paused : true, onUpdate: plugin.updateSlider});
        },

        //Обновление скролла во время анимации
        updateSlider: function(){
            plugin.scroll.slider("value", this.progress() * 100);
        },
        recalculate: function(){
            this.$winWidth      = this.$body.width();
            this.$winHeight     = this.$body.height();
            this.ANIMATIONSPEED = parseInt(this.$winWidth) / 1280;

            this.slides.css({
                width : this.$winWidth,
                height: this.$winHeight
            });

            if(this.vertical) {
                this.$body.css({
                    overflow: 'hidden'
                });
                this.mainBlock.css({
                    position: 'relative',
                    width : this.$winWidth,
                    height: this.$winHeight * this.slidesCount
                });
                this.slides.css({
                    float: 'none'
                });
            } else {
                this.$body.css({
                    overflow: 'hidden'
                });
                this.mainBlock.css({
                    position: 'relative',
                    width : this.$winWidth * this.slidesCount,
                    height: this.$winHeight
                });
                this.slides.css({
                    float: 'left'
                });
            }
            this.window.on('resize', function(e) {
                plugin.recalculate();
            });
        },

        addClassToSction: function(){
            this.slides.each(function(i){
                $(this).addClass('slides_'+(i+1))
                $(this).data('id', i)
            });
            this.navElement.each(function(i){
                $(this).data('id', i)
            });
        },

        /*Управление анимацией*/
        animatePlay: function(){
            this.ScrollTween.play();
        },
        animateReverse: function(){
            this.ScrollTween.reverse();
        },
        animateStop: function(){
            this.ScrollTween.stop();
        },
        mouseScroll: function(){
            this.$body.on('mousewheel scroll', function(event, delta, deltaX, deltaY){
                var stopScrollAnim = true;
                if(stopScrollAnim) {
                    if(deltaY < 0) {
                        plugin.animatePlay();
                    }
                    //Скролл от себя
                    if(deltaY > 0) {
                        plugin.animateReverse();
                    }
                }
                //Отслеживание остановки скроллирования
                function stopScroll() {
                    plugin.animateStop();
                    stopScrollAnim = false;
                    clearTimeout(timer);
                }
                var timer = setTimeout(stopScroll, 50);
            });
        },
        customScroll: function(){
            this.scroll.slider({
                range: false,
                min: 0,
                max: 100,
                step:.1,
                slide: function( event, ui ){
                    //Прогресс всей анимационной цепочки
                    plugin.ScrollTween.progress( ui.value/100 ).pause();
                }
            });
        },
        //Обсерверу нужно вешать обработчики для событий при нажатии кнопки и выбрасывания по завершению прохождения секции
        observer: function(){
            for(var i = 0; i <= this.slidesCount; i++) {
                (function(i){
                    plugin.$body.bind('click:'+i, function(){
                        $(this).bind(plugin.event+':'+i, function(){
                            plugin.animateStop();
                        });
                    });
                })(i);
            }
        },
        activeClass: function(){
            for(var i = 0; i <= this.slidesCount; i++) {
                (function(i){
                    plugin.$body.bind(plugin.event+':'+i, function(){
                        plugin.slides.removeClass('active');
                        plugin.slides.eq(i).addClass('active');
                        plugin.navElement.removeClass('active');
                        plugin.navElement.parent().eq(i).children().addClass('active');
                    });
                })(i);
            }
        },
        unbindEvent: function(){
            for(var i = 0; i <= this.slidesCount; i++) {
                (function(i){
                    plugin.$body.unbind('click:'+i);
                    plugin.$body.unbind(plugin.event+':'+i);
                })(i);
            }
        },
        keyboardBind: function(){
            if(this.keyboard) {
                this.$body.on('keydown', function(event){
                    var keyCode = event.keyCode;
                    if (keyCode == plugin.keyPlay) {
                        event.preventDefault();
                        plugin.animatePlay();
                    }
                    if (keyCode == plugin.keyReverse) {
                        event.preventDefault();
                        plugin.animateReverse();
                    }
                });
                this.$body.on('keyup', function(event){
                    var keyCode = event.keyCode;
                    if (keyCode == plugin.keyPlay || keyCode == plugin.keyReverse) {
                        plugin.animateStop();
                    }
                });
            }
        },
        throwEvent: function(n) {
            this.$body.trigger(this.event+':'+n);
        },
        //Кнопочная анимация, при клике уберает с боди обработчик события активной кнопки, после чего реактивирует обсервер, а также бросает событие 'click:номер кнопки'
        navigate: function(){
            this.navElement.on('click', function(event) {
                event.preventDefault();
                var button       = $(event.currentTarget);
                var activeButton = button.data('id');
                var activeSlide  = plugin.slides.filter('.active').data('id');

                plugin.unbindEvent();
                plugin.observer();
                plugin.activeClass();

                if(activeButton == activeSlide) {
                    return false;
                }
                if(activeButton > activeSlide) {
                    plugin.animatePlay();
                }
                if(activeButton < activeSlide) {
                    plugin.animateReverse();
                }
                $(this).trigger('click:'+activeButton)
            });
        },
        animate: function(){

            //Анимация
            var plugin = this;


            var mainBlock = this.mainBlock;
            var road = $('.road');
            var slide1 = $('.slide_1_long');
            var slide2 = $('.slide_2');
            var car1 = $('.car_1');
            var car2 = $('.car_2');
            var car3 = $('.car_3');
            var text_sign_0 = $('.text_sign_0');
            var text_sign_1 = $('.text_sign_1');
            var text_sign_2 = $('.text_sign_2');
            var letterT = $('.letter-t');
            var letterB = $('.letter-b');
            var overlay = $('.overlay');


            var gate_b_frame = $('.gate_b_frame');
            var gate_t_frame = $('.gate_t_frame');
            var text_sign_3 = $('.text_sign_3');
            var text_sign_4 = $('.text_sign_4');
            var vetka_1 = $('.vetka_t');
            var vetka_2 = $('.vetka_b');
            var bird = $('.bird');

            this.ScrollTween
                .to(text_sign_0,2, {css:{scale: '5', alpha: '0', zIndex: '-1'},
                    onStart : function(){ //Смещение окна
                        //выброс события о смещении
                        plugin.throwEvent(0);
                    }
                })
                .to(text_sign_1,.25, {css:{alpha: '1'}, delay:.25,
                    onReverseComplete : function(){ //Смещение окна
                        //выброс события о смещении
                        plugin.throwEvent(0);
                    }
                })
                .to(text_sign_2,.2, {css:{alpha: '1', ease:Linear.easeNone}})
                .insertMultiple([
                    TweenMax.staggerTo(letterB, 0.3, {css:{bottom: '-1000%', alpha: '0', ease:Linear.easeNone},delay: 2.45}),
                    TweenMax.staggerTo(letterT, 0.3, {css:{top: '-1000%', alpha: '0', ease:Linear.easeNone}, delay: 2.45})
                ])
                .to(text_sign_2,.2, {css:{rotation:'+=20', alpha: '0', ease:Linear.easeNone}, yoyo: true})
                .to(overlay,.5, {css:{alpha: '0', ease:Linear.easeNone}, duration:.5})
                .to(car1, 1, {css:{top: '120%', ease:Linear.easeNone}})
                .to(car2, 1, {css:{bottom: '200%', ease:Linear.easeNone}})
                .to(car3, 1, {css:{top: '120%', ease:Linear.easeNone}})
                .to(mainBlock, 1, {css: {left: -plugin.$winWidth},
                    onComplete : function(){ //Смещение окна
                        //выброс события о смещении
                        plugin.throwEvent(1);
                    }
                })
                .insertMultiple([
                    TweenMax.to(gate_b_frame,.5, {css:{rotation: '-=92', ease:Linear.easeNone}, delay: 7}),
                    TweenMax.to(gate_t_frame,.5, {css:{rotation: '+=92', ease:Linear.easeNone}, delay: 7})
                ])
                .to(mainBlock, 5, {css: {left: -plugin.$winWidth*2},
                    onComplete : function(){
                        plugin.throwEvent(2);
                    },
                    onReverseComplete : function(){ //Смещение окна
                        //выброс события о смещении
                        plugin.throwEvent(1);
                    }
                })
                .insertMultiple([
                    TweenMax.to(vetka_1,8, {css:{left: '-100%', ease:Cubic.easeIn}, delay: 10}),
                    TweenMax.to(vetka_2,5, {css:{left: '-100%', ease:Cubic.easeIn}, delay: 10}),
                    TweenMax.to(bird,12, {css:{left: '-100%', ease:Cubic.easeIn}, delay: 10})
                ])
                .to(mainBlock, 5, {css: {left: -plugin.$winWidth*3},
                    onComplete : function(){
                        plugin.throwEvent(3);
                    },
                    onReverseComplete : function(){ //Смещение окна
                        //выброс события о смещении
                        plugin.throwEvent(2);
                    }
                })
            function animateBirdWings(){
                setTimeout(function(){
                    $('.bird_wing_1').css('display', 'none');
                    $('.bird_wing_2').css('display', 'block');
                    setTimeout(function(){
                        $('.bird_wing_2').css('display', 'none');
                        $('.bird_wing_3').css('display', 'block');
                        setTimeout(function(){
                            $('.bird_wing_3').css('display', 'none');
                            $('.bird_wing_4').css('display', 'block');
                            setTimeout(function(){
                                $('.bird_wing_4').css('display', 'none');
                                $('.bird_wing_1').css('display', 'block');
                            }, 100)
                        }, 100)
                    }, 100)
                }, 100);
                setTimeout(animateBirdWings, 500)
            }
            animateBirdWings();
        }
    };
    return {
        init: function(opt){
            return plugin.initialize(opt)
        }
    }
})();
