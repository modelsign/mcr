<template>
    <i class="msign" :class="iconId"></i>
</template>
<style scoped="">


    @font-face {
        font-family: "msign";
        src: url('//at.alicdn.com/t/font_539785_b6eebetiluucjtt9.eot?t=1522209421275'); /* IE9*/
        src: url('//at.alicdn.com/t/font_539785_b6eebetiluucjtt9.eot?t=1522209421275#iefix') format('embedded-opentype'), /* IE6-IE8 */ url('data:application/x-font-woff;charset=utf-8;base64,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') format('woff'),
        url('//at.alicdn.com/t/font_539785_b6eebetiluucjtt9.ttf?t=1522209421275') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/ url('//at.alicdn.com/t/font_539785_b6eebetiluucjtt9.svg?t=1522209421275#msign') format('svg'); /* iOS 4.1- */
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

    .msign-indoorto:before {
        content: "\e70d";
    }

    .msign-mailing:before {
        content: "\e71b";
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

    .msign-note:before {
        content: "\e6ef";
    }

    .msign-lightning:before {
        content: "\e68a";
    }

    .msign-house:before {
        content: "\e617";
    }

    .msign-users:before {
        content: "\e61e";
    }

    .msign-github:before {
        content: "\ea0a";
    }

    .msign-slack:before {
        content: "\ea31";
    }

    .msign-documentation:before {
        content: "\eb09";
    }

    .msign-console:before {
        content: "\e656";
    }

    .msign-mcr:before {
        content: "\e601";
    }

    .msign-eye:before {
        content: "\e629";
    }

    .msign-location:before {
        content: "\eb0a";
    }

    .msign-sharing:before {
        content: "\e68b";
    }

    .msign-mcloud:before {
        content: "\e60f";
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
