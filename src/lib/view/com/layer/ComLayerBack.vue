<template>
    <div class="bg">
        <com-util-icon-svg class="bg-icon" icon="msign-mcr"></com-util-icon-svg>
    </div>
</template>

<script>
  import ComUtilIconSvg from '../util/ComUtilIconSvg';

  export default {
    components: { ComUtilIconSvg },
    name      : 'com-layer-back'
  };
</script>

<style scoped>
    .bg {
        width: 100%;
        height: 100%;

        display: flex;
        font-size: 80vmin;
    }

    .bg-icon {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        opacity: .2;
        filter: blur(512px);
    }
</style>
