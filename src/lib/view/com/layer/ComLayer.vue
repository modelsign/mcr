<template>
    <div class="layers">
        <div class="layer" v-for="layer in layers">
            <component :is="layer"></component>
            <com-dev-label :tag="layer.name"></com-dev-label>
        </div>
    </div>
</template>

<script>
  import { ComDevLabel } from '../../msui';

  import ComLayerBack from './ComLayerBack';
  import ComLayerGraph from './ComLayerGraph';
  import ComLayerScreen from './ComLayerScreen';
  import ComLayerTrack from './ComLayerTrack';

  export default {
    name      : 'com-layer',
    components: { ComDevLabel },
    data () {
      return {
        layers: [
          ComLayerBack,
          ComLayerGraph,
          ComLayerScreen,
          ComLayerTrack
        ]
      };
    }
  };
</script>

<style scoped>
    .layers {
        width: 100%;
        height: 100%;
    }

    .layer {
        position: absolute;

        width: 100%;
        height: 100%;

    }
</style>
