System.register(["aurelia-framework"],function(e){"use strict";function r(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function t(e,r,t){var n=t[r];if(n){var i={};for(var o in n)i[o]=n[o];i.value=i.initializer.call(e),Object.defineProperty(e,r,i)}}var n,i,o=function(){function e(e,r,t){for(var n=0;n<r.length;n++){var i=r[n],o=i.decorators,a=i.key;if(delete i.key,delete i.decorators,i.enumerable=i.enumerable||!1,i.configurable=!0,("value"in i||i.initializer)&&(i.writable=!0),o){for(var u=0;u<o.length;u++){var f=o[u];if("function"!=typeof f)throw new TypeError("The decorator for method "+i.key+" is of the invalid type "+typeof f);i=f(e,a,i)||i}if(void 0!==i.initializer){t[a]=i;continue}}Object.defineProperty(e,a,i)}}return function(r,t,n,i,o){return t&&e(r.prototype,t,i),n&&e(r,n,o),r}}();return{setters:[function(e){n=e.bindable}],execute:function(){i=function(){function e(){r(this,e),t(this,"router",i)}var i={};return o(e,[{key:"router",decorators:[n],initializer:function(){return null},enumerable:!0}],null,i),e}(),e("NavBar",i)}}});