<template>
    <div class="tool">
        <div class="btn-group">
            <button
                    v-for="menu in menus"
                    class="tool-btn btn btn-primary"
                    v-tooltip.top="menu.title"
            >
                <com-icon-svg :icon="menu.icon"></com-icon-svg>
            </button>
        </div>
    </div>
</template>
<style scoped="">

    .tool {

        pointer-events: all;

        display: flex;
        align-items: center;
        justify-content: center;

        min-height: 32px;
        min-width: 128px;

        height: 64px;

        /*border-color: #000;*/
        /*border-width: 1px;*/
        /*border-style: double;*/

        /*background-color: rgba(58, 103, 140, 0.45);*/
    }

    .tool-btn {
        width: 42px;
        height: 42px;
        margin: 0;
        padding: 0;

        border-radius: 4px;
    }

    .tooltip-custom {
        background-color: transparent;
    }
</style>
<script>
  import Vue from 'vue';
  import Tooltip from 'vue-directive-tooltip';
  import '!style-loader!css-loader!vue-directive-tooltip/css/index.css';

  Vue.use(Tooltip, {
    delay    : 0,
    placement: 'auto',
    class    : 'tooltip-custom', // ex: 'tooltip-custom tooltip-other-custom'
    triggers : ['hover', 'focus'],
    offset   : 5
  });

  const vm = {

    menus: [
      {
        title: '按钮名称',
        icon : 'icon-copyright'
      },
      {
        title: '按钮名称',
        icon : 'icon-copyright'
      },
      {
        title: '按钮名称',
        icon : 'icon-copyright'
      },
      {
        title: '按钮名称',
        icon : 'icon-copyright'
      },
      {
        title: '按钮名称',
        icon : 'icon-copyright'
      },
      {
        title: '按钮名称',
        icon : 'icon-copyright'
      }
    ]
  };
  export default {
    components: {},
    data () {
      return vm;
    },
    methods   : {},
    mounted   : function () {
      console.log('icon-copyright');
    }
  };
</script>
