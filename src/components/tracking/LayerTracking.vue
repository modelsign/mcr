<template>
    <div class="layer-tracking full-width full-height">
        <com-footer></com-footer>

        <!--放置控件-->
        <div class="con">
            <com-con-direction></com-con-direction>
        </div>

        <div class="dev" v-show="stateSettingISDebug">
            <com-dev-looger></com-dev-looger>
        </div>
    </div>
</template>
<style scoped="">
    .layer-tracking {
        position: absolute;
        top: 0;
        margin: 0;
        padding: 0;

        pointer-events: none;
    }

    .con {
        position: relative;

    }
</style>
<script>

  import ComFooter from './ComFooter.vue';
  import ComDevLooger from './ComDevLogger.vue';
  import ComConDirection from './ComConDirection.vue';

  export default {
    components: { ComFooter, ComDevLooger, ComConDirection },
    data () {
      return {};
    },
    stores    : {
      stateSettingISDebug: 'state.setting.isDebug'
    },
    methods   : {},
    mounted   : function () {
      console.log('');
    }
  };
</script>
