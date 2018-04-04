<template>
    <div class="graph" ref="threeContainer">
        加载失败.
    </div>
</template>

<script>
  import DelegateThree from '../../../delegate/DelegateThree';

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
      return {};
    },
    async mounted () {
      let delThree        = new DelegateThree();
      let threeContainer  = await delThree.create(this.$refs.threeContainer);
      this.threeContainer = threeContainer;
    }
  };
</script>

<style scoped>
    .graph {
        width: 100%;
        height: 100%;
    }
</style>
