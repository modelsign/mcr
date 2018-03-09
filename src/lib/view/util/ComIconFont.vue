<template>
    <i class="msign" :class="iconId"></i>
</template>
<style scoped="">


    @font-face {
        font-family: "msign";
        src: url('//at.alicdn.com/t/font_539785_89zd8ahpii9t3xr.eot?t=1519955891800'); /* IE9*/
        src: url('//at.alicdn.com/t/font_539785_89zd8ahpii9t3xr.eot?t=1519955891800#iefix') format('embedded-opentype'), /* IE6-IE8 */ url('data:application/x-font-woff;charset=utf-8;base64,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') format('woff'),
        url('//at.alicdn.com/t/font_539785_89zd8ahpii9t3xr.ttf?t=1519955891800') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/ url('//at.alicdn.com/t/font_539785_89zd8ahpii9t3xr.svg?t=1519955891800#msign') format('svg'); /* iOS 4.1- */
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
