import $ from 'jquery';
import EasyParallax from '../../src';
import {gsap, Linear, SteppedEase} from 'gsap';
import MotionPathPlugin from 'gsap/MotionPathPlugin';

gsap.config({
    nullTargetWarn: false,
});
gsap.registerPlugin(MotionPathPlugin);

var easyParallax = new EasyParallax({
    mainContainer         : '#site',
    customScroll          : true,
    customScrollContainer : '#drag-container',
    customScrollProgress  : '.drag-elem',
    customScrollBar       : '.drag-bar',
    pagingClass: '.paging',
    animation: function() {
        var _this = this;

        //Find elements
        var scrollArea      = $('#wrapper'),
            menu            = $('.menu'),
            donkey          = $('.donkey'),
            mario           = $('.mario'),
            secret          = $('.secret'),
            mushroom        = $('.mushroom'),
            groundTop       = $('.ground_top'),
            cloud_1         = $('.cloud_1'),
            cloud_2         = $('.cloud_2'),
            cloud_3         = $('.cloud_3'),
            cloud_4         = $('.cloud_4'),
            cloud_5         = $('.cloud_5'),
            block3d         = $('.block_3d'),
            explo           = $('.explosion'),
            rocket          = $('.rocket_rocket'),
            explo_donkey    = $('.explo'),
            donkey_2        = $('.donkey_2'),
            back            = $('.back'),
            trees           = $('.trees'),
            tubes           = $('.tubes'),
            mushroom_big    = $('.big_mushroom_2'),
            bad_mushroom    = $('.bad_mushroom'),
            enemy           = $('.enemy'),
            path            = $('.path'),
            key             = $('.key'),
            /*Texts*/
            text_1          = $('#text_1 > div').children(),
            letters_2       = $('#text_2 div'),
            textDiv         = $('#text_0'),
            textDiv2        = $('#text_01'),
            textDiv3        = $('.text_3'),
            textDiv4        = $('#text_4'),
            letters_0       = [],
            /*Texts END*/
            /*Gabarites*/
            donkeyWidth     = donkey.width(),
            marioWidth      = mario.width(),
            pathWidth       = path.width(),
            /*Gabarites END*/
            /*Position elements*/
            donkey_2Position = donkey_2.position().left,
            endSlide2        = $('.slides_2').position().left*2,
            endPath          = path.position().left,
            /*Position elements END*/
            /*Path*/
            path = [
                {x:0,    y:0},
                {x:91,   y:0},
                {x:611,  y:-108},
                {x:767,  y:-127},
                {x:1123, y:-107},
                {x:1500, y:-65},
                {x:1603, y:-65},
                {x:1703, y:-65},
                {x:1870, y:-75},
                {x:2480, y: -200},
                {x:2600, y: -190},
                {x:2700, y: -170},
                {x:2800, y: -140},
                {x:2900, y: -100},
                {x:3000, y: -55},
                {x:3050, y: -40},
                {x:3200, y: -8}
            ],
            marioPath = gsap.to(mario,
                {
                    motionPath: {
                        path,
                    },
                    paused: true,
                    ease: Linear.easeNone
                }
            );
        /*Path END*/

        /*Animation clouds*/
        gsap.to(cloud_1, 50,{css:{backgroundPosition: '-3000px 0'}, repeatDelay:0, repeat:-1,ease:Linear.easeNone});
        gsap.fromTo(cloud_2, getRandomInt(25, 50),{css:{left: getRandomInt(0, $('#wrapper').width()), top: getRandomInt(0, 300)}, repeatDelay:0, repeat:-1,ease:Linear.easeNone},{css:{left: 0-cloud_2.width(), top: getRandomInt(0, 300)}, repeatDelay:0, repeat:-1,ease:Linear.easeNone});
        gsap.fromTo(cloud_3, getRandomInt(25, 50),{css:{left: getRandomInt(0, $('#wrapper').width()), top: getRandomInt(0, 300)}, repeatDelay:0, repeat:-1,ease:Linear.easeNone},{css:{left: 0-cloud_2.width(), top: getRandomInt(0, 300)}, repeatDelay:0, repeat:-1,ease:Linear.easeNone});
        gsap.fromTo(cloud_4, getRandomInt(25, 50),{css:{left: getRandomInt(0, $('#wrapper').width()), top: getRandomInt(0, 300)}, repeatDelay:0, repeat:-1,ease:Linear.easeNone},{css:{left: 0-cloud_2.width(), top: getRandomInt(0, 300)}, repeatDelay:0, repeat:-1,ease:Linear.easeNone});
        gsap.fromTo(cloud_5, getRandomInt(25, 50),{css:{left: getRandomInt(0, $('#wrapper').width()), top: getRandomInt(0, 300)}, repeatDelay:0, repeat:-1,ease:Linear.easeNone},{css:{left: 0-cloud_2.width(), top: getRandomInt(0, 300)}, repeatDelay:0, repeat:-1,ease:Linear.easeNone});
        /*Animation clouds ENDS*/

        /*Animation sprites*/
        var steppedEase = SteppedEase.config(2-1);

        for (var i = 0;i < 3;i++) {
            gsap.fromTo(mario, 0.3, { backgroundPosition:'0 0'}, { backgroundPosition: '-'+(189*i)+'px 0', ease:steppedEase, repeat:-1} );
        }
        for (var i = 0;i < 3;i++) {
            gsap.fromTo(donkey,.7, { backgroundPosition:'0 0'}, { backgroundPosition: '-'+(256*i)+'px 0', ease:steppedEase, repeat:-1} );
        }
        for (var i = 0;i < 3;i++) {
            gsap.fromTo(explo_donkey,.7, { backgroundPosition:'0 0'}, { backgroundPosition: '-'+(600*i)+'px 0', ease:steppedEase, repeat:-1} );
        }
        function getRandomInt (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        /*Animation sprites END*/

        /*Function split text for screw animation*/
        function sliceText(textDiv) {
            var sentence = textDiv.html().split(""),
                tl = gsap.timeline({repeat:10, repeatDelay:0.4, yoyo:true});

            textDiv.html("");
            $.each(sentence, function(index, val) {
                if(val === " ") {
                    val = "&nbsp;";			}
                var letter = $("<span/>", {id : "txt" + index}).html(val).appendTo(textDiv);
                letters_0.push(letter)
            });
        }
        sliceText(textDiv);
        /*Function split text for screw animation END*/
        textDiv.css('display', 'block');
        /*Animation tween*/
        this.timeline
            .addLabel('start')
            /*Author tween*/
            .staggerTo(letters_0,.2, {css:{
                    autoAlpha      : 1,
                    rotationX      : 360,
                    transformOrigin: "50% 50% -20"
                }}, 0.1)
            /*Author tween hide*/
            .to(textDiv, .2, {css: {
                    opacity:0,
                    zIndex: 0
                }})
            /*Author site show tween*/
            .to(textDiv2, .2, {css: {
                    opacity:1,
                    zIndex: 6
                }})
            /*Author site hide tween*/
            .to(textDiv2, .2, {css: {
                    opacity:0,
                    zIndex: 0,
                }}
            )
            .delay(1)
            /*Donkey Top tween*/
            .to(donkey, 1, {css: {
                    left: $(window).width() + donkeyWidth * 2
                }})
            /******Animation Scene******/
            .add([
                /*Donkey hide*/
                gsap.to(donkey, .5, {css: {
                        alpha: 0
                    }}),
                /*Block 3D show*/
                gsap.to(block3d, 1, {css: {
                        rotationX           : 90,
                        transformOrigin     : "center bottom",
                        transformPerspective: 10000
                    }}),
                /*Ground top*/
                gsap.to(groundTop, 1, {css: {
                        borderRadius: '50% 50% 0 0'
                    }})
            ])
            .addLabel('slide1')
            /******Animation Scene END******/
            .to(mario, 1,{css: {
                    left: '+=' + ($(window).width() / 2 - 70)
                },ease:Linear.easeNone})
            .staggerTo(text_1, 1, {css: {
                    autoAlpha: 1,
                    scale    : 1,
                    zIndex   : 150
                }}, 1)
            /******Animation Scene******/
            .add([
                gsap.to(textDiv3, .25, {css: {
                        autoAlpha:1
                    }}),
                gsap.to(scrollArea, .25, {css: {
                        left: '-=225px'
                    },ease:Linear.easeNone}),
                gsap.to(mario, .25, {css: {
                        bottom: '237px',
                        left  : '+=200px'
                    }, onStart: function(){
                        mario.addClass('jump');
                    }, onComplete: function(){
                        secret.addClass('empty');
                        mushroom.css({opacity: 1});
                    }, onReverseComplete: function(){
                        mushroom.css({opacity: 0});
                        mario.removeClass('jump');
                    }})
            ])

            /******Animation Scene END******/
            /******Animation Scene******/
            .add([
                gsap.to(mushroom, .2, {css: {
                        alpha : 1,
                        bottom: '460px'
                    }}),
                gsap.to(mario, .25, {css: {
                        bottom: '200px',
                        left  : '+=50px'
                    },ease:Linear.easeNone})
            ])
            /******Animation Scene END******/
            /******Animation Scene******/
            .add([
                gsap.to(mario, .25, {css: {
                        bottom: '25px',
                        left  : '+=50px'
                    }, onComplete: function(){
                        mario.removeClass('jump');
                    },ease:Linear.easeNone}),
                gsap.to(mushroom, .25, {css: {
                        bottom: '25px',
                        left  : '1800px'
                    }, ease:Linear.easeNone}),
                gsap.to(scrollArea, .25, {css: {
                        left: '-=150px'
                    }, ease:Linear.easeNone})
            ])
            .add([
                gsap.to(scrollArea, .25, {css: {
                        left: -$(window).width() / 2
                    }, ease:Linear.easeNone}),
                gsap.to(mushroom, .25, {css: {
                        left: '-=250px'
                    }, ease:Linear.easeNone}),
                gsap.to(mario, .25, {css: {
                        left: '+=250px'
                    }, onComplete: function(){
                        mario.removeClass('small');
                        mushroom.addClass('hide');
                    },ease:Linear.easeNone})
            ])
            .to(mario, .1, {css: {
                    left: '+=10px'
                }, onReverseComplete: function(){
                    mario.addClass('small');
                    mushroom.removeClass('hide');
                }, ease:Linear.easeNone})
            .add([
                gsap.to(mushroom_big, 1, {css: {
                        left: -$(window).width()/2
                    }, ease:Linear.easeNone}),
                gsap.to(scrollArea, 1, {css: {
                        left: -endSlide2+850
                    },ease:Linear.easeNone}),
                gsap.to(bad_mushroom, 1, {css: {
                        left: '+=665px'
                    }, ease:Linear.easeNone}),
                gsap.to(mario, 1, {css: {
                        left: endSlide2-850
                    }, ease:Linear.easeNone})
            ])
            .add([
                gsap.to(textDiv3, .1, {css: {
                        autoAlpha:0
                    }}),
                gsap.to(bad_mushroom, .4, {css: {
                        top: '+=200px'
                    }}),
                gsap.to(enemy, .4, {css: {
                        bottom: '+=400px'
                    }, ease:Linear.easeNone}),
                gsap.to(scrollArea, 1.5, {css: {
                        left: -endSlide2+100
                    }, ease:Linear.easeNone}),
                gsap.to(mario, 1.5, {css: {
                        left: endSlide2-91
                    }, ease:Linear.easeNone})
            ])
            .staggerFrom(letters_2, 0.5, {css: {
                    opacity : 0,
                    scale   : 0,
                    rotation: -180
                }}, 0.3)
            .staggerTo(letters_2, 0.3, {css: {
                    scale:0.8
                }}, 0.3, 0.7)
            .to(textDiv4, .35, {css: {
                    autoAlpha: 1
                }})
            .to(textDiv3, .1, {css: {
                    autoAlpha: 1,
                }})
            .delay(1)
            .addLabel('slide2')
            .add([
                gsap.to(scrollArea, 4, {css: {
                        left: -endSlide2-pathWidth
                    }, ease:Linear.easeNone}),
                gsap.to(marioPath, 4, {
                    progress:1,
                    ease:Linear.easeNone
                })
            ])
            .add([
                gsap.to(scrollArea, 4, {css: {
                        left: -endSlide2 - pathWidth - $(window).width()
                    }, ease:Linear.easeNone}),
                gsap.to(mario, 4, {css: {
                        left: endPath + $(window).width()
                    }, ease:Linear.easeNone}),
                gsap.to(back, 3, {css: {
                        left: '-=10%'
                    }}),
                gsap.to(trees, 3.5, {css: {
                        left: '-=20%'
                    }}),
                gsap.to(tubes, 4, {css: {
                        left: '-=45%'
                    }})
            ])
            .addLabel('slide3')
            .to(mario, .1, {css: {
                    left: '+=10px'
                }, onComplete: function(){
                    mario.addClass('rocket_mario');
                }, ease:Linear.easeNone})
            .to(mario, .1, {css: {
                    left: '+=10px'
                }, onComplete: function(){
                    mario.addClass('rocket_mario');
                }, ease:Linear.easeNone})
            .add([
                gsap.to(mario, .1, {css: {
                        left: '-=10px'
                    }, onReverseComplete: function(){
                        mario.removeClass('rocket_mario');
                    }, ease:Linear.easeNone}),
                gsap.to(explo, .1, {css: {
                        alpha: 1
                    }}),
                gsap.to(rocket, 1, {css: {
                        alpha: 1,
                        right: -donkey_2Position
                    }})
            ])
            .to(explo, .05, {css: {
                    alpha: 0
                }, onComplete: function(){
                    mario.removeClass('rocket_mario');
                }})
            .to(rocket, .05, {css: {
                    alpha: 0
                }, onReverseComplete: function(){
                    mario.addClass('rocket_mario');
                }})
            .to(explo_donkey, .1, {css: {
                    alpha: 1
                }})
            .to(donkey_2, .1, {css: {
                    alpha: 0,
                }})
            .delay(0.5)
            .to(explo_donkey, .1, {css: {
                    alpha: 0
                }})
            .to(key, .1, {css: {
                    alpha : 1,
                    bottom: '25px'
                }})
            .to(mario, 1, {css: {
                    left: '+=' + ( (donkey_2Position - marioWidth / 2) - 50 ) + 'px'
                }, ease:Linear.easeNone})
            .to(key,.1, {css: {
                    alpha: 0
                }})
    }
});
