<template>
    <div class="mcr">
        <transition name="fade">
            <layer-graph></layer-graph>
        </transition>
        <transition name="fade">
            <layer-tracking></layer-tracking>
        </transition>
    </div>
</template>

<style type="text/css" scoped="">
    .mcr {
        position: relative;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        opacity: 0;
    }
</style>

<script type="text/javascript">
  import { mapState } from 'vuex';

  /** **********************
   * 引入三方样式
   * 这些样式都会被处理
   * 加上自定义的[scope]属性
   *************************/
  import (/* webpackChunkName: "style" */'normalize.css');
  import (/* webpackChunkName: "style" */'./assets/css/bootstrap.min14ed.css');
  import (/* webpackChunkName: "style" */'./assets/css/animate.min.css');
  import (/* webpackChunkName: "style" */'./assets/css/style.min862f.css');
  import (/* webpackChunkName: "style" */'./assets/css/style.less');

  /** **********************
   * 引入基础库
   *************************/

  /** **********************
   * 统一使用异步组件
   *************************/
  const promiseLayerGraph    = import(/* webpackChunkName: "ui" */'./components/graph/m-three.vue'),
        promiseMEmpty        = import(/* webpackChunkName: "ui" */'./components/util/ComEmpty.vue'),
        promiseLayerTracking = import(/* webpackChunkName: "ui" */'./components/tracking/LayerTracking.vue')
  ;

  export default {
    filters   : {},
    data () {
      return {};
    },
    components: {
      LayerGraph   : () => promiseLayerGraph,
      LayerTracking: () => promiseLayerTracking
    },
    created () {
    },
    mounted () {
    },
    computed  : mapState({ onelist: state => state.onelist }),
    methods   : {}
  };

</script>
