$(function() {
    var easyParallax = new EasyParallax({
        mainContainer         : '#site',

        customScroll          : false,
        customScrollContainer : '#drag-container',
        customScrollElem      : '.drag-elem',
        customScrollBar       : '.drag-bar',
        pagination            : '.paging',
        animation: function() {
            var _this = this;

            var mario           = $('.mario')

            this.timeline
                .to(mario, 1,{css: {
                    left: '+=' + ($(window).width() / 2 - 70)
                },ease:Linear.easeNone})

        }
    });
});