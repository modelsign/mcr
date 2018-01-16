<template>
    <i class="msign" :class="iconId"></i>
</template>
<style scoped="">

    @font-face {
        font-family: "msign";
        src: url('//at.alicdn.com/t/font_539785_ifkmhx2vqcfecdi.eot?t=1516022156544'); /* IE9*/
        src: url('//at.alicdn.com/t/font_539785_ifkmhx2vqcfecdi.eot?t=1516022156544#iefix') format('embedded-opentype'), /* IE6-IE8 */ url('data:application/x-font-woff;charset=utf-8;base64,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') format('woff'),
        url('//at.alicdn.com/t/font_539785_ifkmhx2vqcfecdi.ttf?t=1516022156544') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/ url('//at.alicdn.com/t/font_539785_ifkmhx2vqcfecdi.svg?t=1516022156544#msign') format('svg'); /* iOS 4.1- */
    }

    .msign {
        font-family: "msign" !important;
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .msign-home:before {
        content: "\e628";
    }

    .msign-copyright:before {
        content: "\e62b";
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
