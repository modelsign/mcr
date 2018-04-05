<template>
    <div class="graph"
         @mouseleave="onGraphMouseleave"
         ref="threeContainer">
        加载失败.
    </div>
</template>

<script>
  import DelegateThree from '../../../delegate/DelegateThree';
  import global from '../../../core/Global';
  import { debounce, throttle } from 'lodash';

  export default {
    name      : 'com-layer-graph',
    components: {
      'three-container': {
        render: function (createElement) {
          return createElement(
              'h' + this.level,
              this.$slots.default
          );
        }
      }
    },
    data () {
      return {
        delThree: new DelegateThree()
      };
    },
    methods   : {
      initDelThreeDispatch () {
        let delThree = this.delThree;
        let control  = delThree.getControl();
        control.addEventListener(
            'start',
            this.onControlStart
        );
        control.addEventListener(
            'change',
            this.onControlChange
        );
        control.addEventListener(
            'end',
            this.onControlEnd
        );
      },
      onControlStart (event) {
        global.isRend = true;
        global.bus.emit('log/runtime', event);
      },
      onControlChange (event) {
        global.isRend = true;
        // global.bus.emit('log/runtime', event);
      },
      onControlEnd (event) {
        global.bus.emit('log/runtime', event);
      },
      onGraphMouseleave (event) {
        requestAnimationFrame(() => {
          global.isRend = false;
        });
      }
    },
    async mounted () {
      let delThree        = this.delThree;
      let threeContainer  = await delThree.create(this.$refs.threeContainer);
      this.threeContainer = threeContainer;

      this.initDelThreeDispatch();

      global.delegateThree = delThree;
      global.bus.on('core/tick', (t) => {
        if (global.isRend) {
          delThree.render(t);
        }
      });
    }
  };
</script>

<style scoped>
    .graph {
        width: 100%;
        height: 100%;

        pointer-events: all;
    }
</style>
