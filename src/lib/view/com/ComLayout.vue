<template>
    <div class="layout">
        <com-layers></com-layers>
    </div>
</template>

<script>
  import ComLayers from './layer/ComLayer';
  import 'normalize.css';

  export default {
    name      : 'com-layout',
    components: { ComLayers }
  };

</script>

<style scoped>
    .layout {
        width: 100%;
        height: 100%;
    }

</style>
