let utils =  {
    query: function(elem, className) {
        return elem.querySelector(className);
    },

    find: function(elem, className) {
        var collection = elem.querySelectorAll(className);
        return Array.prototype.slice.call(collection);
    },

    css: function(elem, style, prop) {
        elem.style[style] = prop;
    },

    trigger: function(elem, eventName) {
        var event = new Event(eventName, {bubbles: true, cancelable: false});
        elem.dispatchEvent(event);
    },

    scrollTop: function() {
        const yOffset = window.scrollY || window.pageYOffSet;

        if(typeof yOffset !== 'undefined'){
            return yOffset;
        }
        else{
            var body     = document.body,
                document = document.documentElement;

            document = (document.clientHeight)? document: body;

            return document.scrollTop;
        }
    },

    on: function(el, evt, fn, ctx) {
        try {
            el.addEventListener(evt, fn.bind(ctx));
        } catch(e) {
            console.log(e)
        }
    }
};

export default utils;
