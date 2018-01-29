<template>
    <i class="msign" :class="iconId"></i>
</template>
<style scoped="">

    @font-face {font-family: "msign";
        src: url('//at.alicdn.com/t/font_539785_sqvtaz3l4mcmcxr.eot?t=1517216948372'); /* IE9*/
        src: url('//at.alicdn.com/t/font_539785_sqvtaz3l4mcmcxr.eot?t=1517216948372#iefix') format('embedded-opentype'), /* IE6-IE8 */
        url('data:application/x-font-woff;charset=utf-8;base64,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') format('woff'),
        url('//at.alicdn.com/t/font_539785_sqvtaz3l4mcmcxr.ttf?t=1517216948372') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
        url('//at.alicdn.com/t/font_539785_sqvtaz3l4mcmcxr.svg?t=1517216948372#msign') format('svg'); /* iOS 4.1- */
    }

    .msign {
        font-family:"msign" !important;
        font-size:16px;
        font-style:normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .msign-select:before { content: "\e685"; }

    .msign-zoomout:before { content: "\e73a"; }

    .msign-zoomin:before { content: "\e73c"; }

    .msign-home:before { content: "\e628"; }

    .msign-copyright:before { content: "\e62b"; }

    .msign-orbit:before { content: "\e659"; }

    .msign-transfer:before { content: "\e669"; }

    .msign-camera:before { content: "\e607"; }

    .msign-house:before { content: "\e617"; }

    .msign-documentation:before { content: "\eb09"; }

    .msign-logo:before { content: "\e601"; }


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
