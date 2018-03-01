<template>
    <i class="msign" :class="iconId"></i>
</template>
<style scoped="">
    
    @font-face {
        font-family: "msign";
        src: url('//at.alicdn.com/t/font_539785_se9x7g4cf3ucjtt9.eot?t=1517222043350'); /* IE9*/
        src: url('//at.alicdn.com/t/font_539785_se9x7g4cf3ucjtt9.eot?t=1517222043350#iefix') format('embedded-opentype'), /* IE6-IE8 */ url('data:application/x-font-woff;charset=utf-8;base64,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') format('woff'),
        url('//at.alicdn.com/t/font_539785_se9x7g4cf3ucjtt9.ttf?t=1517222043350') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/ url('//at.alicdn.com/t/font_539785_se9x7g4cf3ucjtt9.svg?t=1517222043350#msign') format('svg'); /* iOS 4.1- */
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

    .msign-documentation:before {
        content: "\eb09";
    }

    .msign-console:before {
        content: "\e656";
    }

    .msign-logo:before {
        content: "\e601";
    }

    .msign-eye:before {
        content: "\e629";
    }

    .msign-location:before {
        content: "\eb0a";
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
