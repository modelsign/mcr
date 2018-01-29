<template>
    <div class="tool">
        <div class="btn-group">

            <button
                    v-for="menu in stateMenuBase"
                    class="tool-btn btn btn-lg"
                    :class="{'btn-info':menu.isToggle,'btn-success':!menu.isToggle}"
                    v-tooltip.top="menu.title"
                    @click="onMenuClick(menu)"
            >
                <com-icon-svg :icon="menu.icon"></com-icon-svg>
            </button>

            <button
                    v-for="menu in stateMenuPrimary"
                    class="tool-btn btn btn-lg btn-primary"
                    v-tooltip.top="menu.title"
            >
                <com-icon-svg :icon="menu.icon"></com-icon-svg>
            </button>
        </div>
    </div>
</template>
<style scoped="">

    .tool:hover {
        opacity: 1;
    }

    .tool {
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

        opacity: 0.4;
        transition: all 0.1s ease-in-out;
    }

    .tool-btn {
        pointer-events: all;

        width: 48px;
        height: 48px;
        margin: 0;
        padding: 0;

        font-size: 32px;

        border-radius: 4px;
    }

</style>
<script>
  import Vue from 'vue';
  import Tooltip from 'vue-directive-tooltip';
  import '!style-loader!css-loader!vue-directive-tooltip/css/index.css';

  import em from '../../bus';

  Vue.use(Tooltip, {
    delay    : 0,
    placement: 'auto',
    triggers : ['hover', 'focus'],
    offset   : 5
  });

  const vm = {};
  export default {
    components: {},
    data () {
      return vm;
    },
    stores    : {
      stateMenuBase   : 'state.menu.base',
      stateMenuPrimary: 'state.menu.primary',
      stateMenuAdvance: 'state.menu.advance'
    },
    methods   : {
      onMenuClick (menu) {
        em.emit('event/log/trace', { step: `按钮[${menu.title}]被点击.` });
        if (menu.isToggle) {
          // toggle类型的开关按钮
          if (!menu.isActive && typeof menu.callbackOn === 'function') {
            menu.callbackOn(this);
          } else if (menu.isActive && typeof menu.callbackOff === 'function') {
            menu.callbackOff(this);
          }
        } else {
          // 普通触发按钮
          if (typeof menu.callbackClick === 'function') {
            menu.callbackClick(this);
          }
        }
      }
    },
    mounted   : function () {
      //      console.log('icon-copyright');
    }
  };
</script>
