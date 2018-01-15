<template>
    <div class="layer-tracking full-width full-height">


        <!--放置控件-->
        <div class="con">
            <div class="layer-tracking-grid-row-1 col-xs-12">
                <div class="layer-tracking-grid-col-1 col-xs-1"></div>
                <div class="layer-tracking-grid-col-2 col-xs-10"></div>
                <div class="layer-tracking-grid-col-3 col-xs-1">
                    <com-con-direction></com-con-direction>
                </div>
            </div>
            <div class="layer-tracking-grid-row-0 col-xs-12">
                <div class="layer-tracking-grid-col-1 col-xs-1"></div>
                <div class="layer-tracking-grid-col-2 col-xs-10"></div>
                <div class="layer-tracking-grid-col-3 col-xs-1"></div>
            </div>
            <div class="layer-tracking-grid-row-3 col-xs-12">
                <div class="layer-tracking-grid-col-1 col-xs-1"></div>
                <div class="layer-tracking-grid-col-2 col-xs-10">
                    <com-con-toolbar></com-con-toolbar>
                </div>
                <div class="layer-tracking-grid-col-3 col-xs-1"></div>
            </div>
            <div>
                <com-footer></com-footer>
            </div>
        </div>

        <!--调试控件-->
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
        z-index: 9;

        height: 100%;

        /*border-width: 2px;*/
        /*border-style: dashed;*/
        /*border-color: #0c86ff;*/
    }

    .con > > div > div {
        /*border-width: 1px;*/
        /*border-style: dashed;*/
        /*border-color: #ff002b;*/
    }

    .con > div.layer-tracking-grid-row-3 {
        position: absolute;
        top: 100%;
        margin-top: calc(-64px - 24px - 2px);

        height: 64px;
    }

    .layer-tracking-grid-row-1 {

    }

    .dev {
        z-index: 10;
    }
</style>
<script>

  import ComFooter from './ComFooter.vue';
  import ComDevLooger from './ComDevLogger.vue';
  import ComConDirection from './ComConDirection.vue';
  import ComConToolbar from './ComConToolbar.vue';

  export default {
    components: {
      ComFooter,
      ComDevLooger,
      ComConToolbar,
      ComConDirection
    },
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
