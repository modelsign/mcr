<template>
    <i class="msign" :class="iconId"></i>
</template>
<style scoped="">

    @font-face {
        font-family: "msign";
        src: url('//at.alicdn.com/t/font_539785_5mtc1jrtxaxxbt9.eot?t=1516860278848'); /* IE9*/
        src: url('//at.alicdn.com/t/font_539785_5mtc1jrtxaxxbt9.eot?t=1516860278848#iefix') format('embedded-opentype'), /* IE6-IE8 */ url('data:application/x-font-woff;charset=utf-8;base64,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') format('woff'),
        url('//at.alicdn.com/t/font_539785_5mtc1jrtxaxxbt9.ttf?t=1516860278848') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/ url('//at.alicdn.com/t/font_539785_5mtc1jrtxaxxbt9.svg?t=1516860278848#msign') format('svg'); /* iOS 4.1- */
    }

    .msign {
        font-family: "msign" !important;
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .msign-select:before {
        content: "\e685";
    }

    .msign-zoomout:before {
        content: "\e73a";
    }

    .msign-zoomin:before {
        content: "\e73c";
    }

    .msign-home:before {
        content: "\e628";
    }

    .msign-copyright:before {
        content: "\e62b";
    }

    .msign-orbit:before {
        content: "\e659";
    }

    .msign-transfer:before {
        content: "\e669";
    }

    .msign-camera:before {
        content: "\e607";
    }

    .msign-logo:before {
        content: "\e601";
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
