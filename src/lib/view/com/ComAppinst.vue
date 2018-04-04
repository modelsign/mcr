<template>
    <div class="app-inst">
        <com-layout></com-layout>
    </div>
</template>

<script>
  import ComLayout from './ComLayout';
  import CoreGlobal from '../../core/Global';

  export default {
    components: { ComLayout },
    name      : 'com-appinst',
    compontent: {
      ComLayout
    },
    data () {
      return {};
    },
    methods   : {
      update (time = 0) {
        requestAnimationFrame(this.update);

        CoreGlobal.update(time);
      }
    },
    mounted () {
      this.update();
    }
  };
</script>

<style scoped>
    .app-inst {
        width: 100%;
        height: 100%;
    }
</style>
