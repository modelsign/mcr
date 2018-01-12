<template>
    <i class="iconfont" :class="iconId"></i>
</template>
<style scoped="">

    @font-face {
        font-family: "iconfont";
        src: url('//at.alicdn.com/t/font_536889_ldoztubo9qbk2o6r.eot?t=1515561349701'); /* IE9*/
        src: url('//at.alicdn.com/t/font_536889_ldoztubo9qbk2o6r.eot?t=1515561349701#iefix') format('embedded-opentype') /* IE6-IE8 */,
        url('data:application/x-font-woff;charset=utf-8;base64,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') format('woff'),
        url('//at.alicdn.com/t/font_536889_ldoztubo9qbk2o6r.ttf?t=1515561349701') format('truetype') /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/,
        url('//at.alicdn.com/t/font_536889_ldoztubo9qbk2o6r.svg?t=1515561349701#iconfont') format('svg') /* iOS 4.1- */
    ;
    }

    .iconfont {
        font-family: "iconfont" !important;
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .icon-info:before {
        content: "\e643";
    }

    .icon-copyright:before {
        content: "\e62b";
    }

    .icon-err:before {
        content: "\e60e";
    }

    .icon-info1:before {
        content: "\e665";
    }

    .icon-err1:before {
        content: "\e632";
    }

    .icon-err2:before {
        content: "\e806";
    }


</style>
<script>
  export default {
    name    : 'font-icon',
    props   : {
      icon: {
        type   : String,
        default: ''
      }
    },
    computed: {
      'iconId' () {
        return this.icon || '';
      }
    }
  };
</script>
