<template lang="html">
    <span>
        <svg v-if="iconId" class="svgicon" aria-hidden="true"><use :xlink:href="iconId"></use></svg>
    </span>
</template>
<style>
    .svgicon {
        width: 1em; height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }
</style>
<script>
  export default {
    name    : 'svg-icon',
    props   : {
      icon: {
        type   : String,
        default: ''
      }
    },
    computed: {
      'iconId' () {
        return this.icon ? `#${this.icon}` : '';
      }
    },
    mounted(){
      (function(window){var svgSprite='<svg><symbol id="icon-info" viewBox="0 0 1024 1024"><path d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z" fill="#2196F3" ></path><path d="M469.333333 469.333333h85.333334v234.666667h-85.333334z" fill="#FFFFFF" ></path><path d="M512 352m-53.333333 0a53.333333 53.333333 0 1 0 106.666666 0 53.333333 53.333333 0 1 0-106.666666 0Z" fill="#FFFFFF" ></path></symbol><symbol id="icon-copyright" viewBox="0 0 1024 1024"><path d="M926.991 337.678c-22.571-53.364-54.877-101.283-96.021-142.426-41.143-41.143-89.062-73.449-142.426-96.02-55.266-23.375-113.953-35.228-174.434-35.228-60.48 0-119.168 11.852-174.433 35.228-53.364 22.571-101.283 54.877-142.426 96.02s-73.449 89.062-96.02 142.426c-23.375 55.265-35.228 113.953-35.228 174.433 0 60.48 11.852 119.168 35.228 174.434 22.571 53.364 54.877 101.283 96.02 142.426 41.143 41.144 89.062 73.449 142.426 96.021 55.265 23.375 113.953 35.228 174.433 35.228 60.48 0 119.168-11.853 174.434-35.228 53.364-22.571 101.283-54.877 142.426-96.021 41.144-41.143 73.449-89.062 96.021-142.426 23.375-55.266 35.228-113.953 35.228-174.434 0-60.48-11.853-119.168-35.228-174.433z m-412.88 558.541c-211.797 0-384.107-172.31-384.107-384.107 0-211.797 172.31-384.107 384.107-384.107 211.798 0 384.107 172.31 384.107 384.107 0.001 211.797-172.309 384.107-384.107 384.107z"  ></path><path d="M514.111 290.829c51.918 0 102.431 18.428 142.233 51.889 13.528 11.375 33.715 9.626 45.086-3.902 11.373-13.527 9.626-33.713-3.902-45.086-51.316-43.142-116.456-66.901-183.417-66.901-76.201 0-147.842 29.675-201.725 83.557-53.883 53.883-83.558 125.523-83.558 201.725s29.675 147.843 83.558 201.726 125.523 83.558 201.725 83.558c66.961 0 132.1-23.76 183.417-66.901 13.528-11.372 15.275-31.559 3.902-45.086s-31.559-15.275-45.086-3.902c-39.803 33.462-90.315 51.89-142.233 51.89-122.015 0-221.282-99.268-221.282-221.283 0-122.017 99.267-221.284 221.282-221.284z"  ></path></symbol><symbol id="icon-err" viewBox="0 0 1024 1024"><path d="M512.8 64C760 64 960 265.6 960 512.8s-201.6 448-448.8 447.2C264 960 64 758.4 64 511.2S265.6 64 512.8 64zM512 466.4L353.6 308l-45.6 45.6L466.4 512 308 670.4l45.6 45.6L512 557.6l158.4 158.4 45.6-45.6L557.6 512l158.4-158.4-45.6-45.6L512 466.4z" fill="#0379FE" ></path></symbol><symbol id="icon-info1" viewBox="0 0 1024 1024"><path d="M512 512m-384 0a384 384 0 1 0 768 0 384 384 0 1 0-768 0Z" fill="#FECB2F" ></path><path d="M512 426.666667c25.6 0 42.666667 17.066667 42.666667 42.666666v213.333334c0 25.6-17.066667 42.666667-42.666667 42.666666s-42.666667-17.066667-42.666667-42.666666v-213.333334c0-25.6 17.066667-42.666667 42.666667-42.666666zM469.333333 298.666667h85.333334v85.333333h-85.333334z" fill="#FFFFFF" ></path></symbol><symbol id="icon-err1" viewBox="0 0 1024 1024"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#EE1E25" ></path><path d="M475.428571 219.428571l14.628572 460.8h51.2L555.885714 219.428571H475.428571z m36.571429 519.314286c-14.628571 0-29.257143 7.314286-36.571429 14.628572-7.314286 7.314286-14.628571 21.942857-14.628571 36.571428s7.314286 29.257143 14.628571 36.571429c7.314286 7.314286 21.942857 14.628571 36.571429 14.628571s29.257143-7.314286 36.571429-14.628571c7.314286-7.314286 14.628571-21.942857 14.628571-36.571429s-7.314286-29.257143-14.628571-36.571428c-7.314286-7.314286-21.942857-14.628571-36.571429-14.628572z" fill="#FFFFFF" ></path></symbol><symbol id="icon-err2" viewBox="0 0 1024 1024"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#FF5447" ></path><path d="M512 448L320 256 256 320l192 192-192 192 64 64 192-192 192 192 64-64-192-192 192-192-64-64z" fill="#FFFFFF" ></path></symbol></svg>';var script=function(){var scripts=document.getElementsByTagName('script');return scripts[scripts.length-1];}();var shouldInjectCss=script.getAttribute('data-injectcss');var ready=function(fn){if(document.addEventListener){if(~['complete','loaded','interactive'].indexOf(document.readyState)){setTimeout(fn,0);}else{var loadFn=function(){document.removeEventListener('DOMContentLoaded',loadFn,false);fn();};document.addEventListener('DOMContentLoaded',loadFn,false);}}else if(document.attachEvent){IEContentLoaded(window,fn);}function IEContentLoaded(w,fn){var d=w.document,done=false,init=function(){if(!done){done=true;fn();}};var polling=function(){try{d.documentElement.doScroll('left');}catch(e){setTimeout(polling,50);return;}init();};polling();d.onreadystatechange=function(){if(d.readyState=='complete'){d.onreadystatechange=null;init();}};}};var before=function(el,target){target.parentNode.insertBefore(el,target);};var prepend=function(el,target){if(target.firstChild){before(el,target.firstChild);}else{target.appendChild(el);}};function appendSvg(){var div,svg;div=document.createElement('div');div.innerHTML=svgSprite;svgSprite=null;svg=div.getElementsByTagName('svg')[0];if(svg){svg.setAttribute('aria-hidden','true');svg.style.position='absolute';svg.style.width=0;svg.style.height=0;svg.style.overflow='hidden';prepend(svg,document.body);}}if(shouldInjectCss&&!window.__iconfont__svg__cssinject__){window.__iconfont__svg__cssinject__=true;try{document.write('<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>');}catch(e){console&&console.log(e);}}ready(appendSvg);})(window);
    }
  };
</script>
