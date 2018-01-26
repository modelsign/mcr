<template>
    <div class="com-customize-right">
        <component :is="stateCustomizeRightView"></component>
    </div>
</template>
<style scoped="">
    .com-customize-right {
        width: 100%;
        height: 100%;
        background-color: transparent;
        /*border-radius: 4px;*/
        /*border-style: dashed;*/
        /*border-width: 1px;*/
        /*border-color: #0c86ff;*/
    }

</style>
<script>
  export default {
    components: {},
    data () {
      return {};
    },
    stores    : {
      stateCustomizeRightView: 'state.customize.right'
    },
    methods   : {},
    mounted   : function () {
      console.log('');
    }
  };
</script>
