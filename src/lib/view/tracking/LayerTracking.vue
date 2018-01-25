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
            <div class="layer-tracking-grid-row-2 col-xs-12">
                <div class="layer-tracking-grid-col-1 col-xs-2"></div>
                <div class="layer-tracking-grid-col-2 col-xs-8"></div>
                <div class="layer-tracking-grid-col-3 col-xs-2">
                    <div>
                        <com-customize-right></com-customize-right>
                    </div>
                </div>
            </div>
            <div class="layer-tracking-grid-row-3 col-xs-12">
                <div class="layer-tracking-grid-col-1 col-xs-1"></div>
                <div class="layer-tracking-grid-col-2 col-xs-10">
                    <com-con-toolbar></com-con-toolbar>
                </div>
                <div class="layer-tracking-grid-col-3 col-xs-1">
                    <transition name="fade">
                        <com-loader-rotate v-if="stateCurrentIsProcessing"></com-loader-rotate>
                    </transition>
                </div>
            </div>
            <div>
                <com-footer></com-footer>
            </div>
        </div>

        <div class="tracking">
            <com-track-selector></com-track-selector>
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

    .tracking {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        border-color: red;
        border-width: 1px;
        border-style: dashed;
        border-radius: 2px;
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

    .layer-tracking-grid-row-1, .layer-tracking-grid-row-3 {
        height: 20%;
    }

    .layer-tracking-grid-row-2 {
        height: 60%;
    }

    .layer-tracking-grid-col-1, .layer-tracking-grid-col-2, .layer-tracking-grid-col-3 {
        height: 100%;
    }

    .dev {
        position: absolute;
        top: 0;
        z-index: 10;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }

</style>
<script>
  import ComExtModules from '../../modules/main';

  import ComFooter from './ComFooter.vue';
  import ComCustomizeRight from './ComCustomizeRight.vue';
  import ComDevLooger from './ComDevLogger.vue';
  import ComConDirection from './ComConDirection.vue';
  import ComConToolbar from './ComConToolbar.vue';
  import ComTrackSelector from './ComTrackSelector.vue';

  import { RotateLoader as ComLoaderRotate } from 'vue-spinner/dist/vue-spinner';

  export default {
    components: {
      ComFooter,
      ComCustomizeRight,
      ComDevLooger,
      ComConToolbar,
      ComConDirection,
      ComTrackSelector,
      ComLoaderRotate
    },
    data () {
      return {};
    },
    stores    : {
      stateSettingISDebug     : 'state.setting.isDebug',
      stateCurrentIsProcessing: 'state.current.isProcessing'
    },
    methods   : {},
    mounted   : function () {
      console.log('');
    }
  };
</script>
