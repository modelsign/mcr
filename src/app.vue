<template>
    <div
            @mouseover="onContainerMouseover"
            @touchstart="onContainerMouseover"
            @mouseleave="onContainerMouseout"
            @touchend="onContainerMouseout"
            id="mcr-platform"
            class="mcr">
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
  const TIME_SECONDS = 5000;
  import em from './lib/bus';
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
  const promiseLayerGraph    = import(/* webpackChunkName: "core" */'./lib/view/graph/m-three.vue'),
        promiseMEmpty        = import(/* webpackChunkName: "core" */'./lib/view/util/ComEmpty.vue'),
        promiseLayerTracking = import(/* webpackChunkName: "core" */'./lib/view/tracking/LayerTracking.vue')
  ;

  /** ************************************************************
   *
   *              提交一部分涉及到三维组件的全局实例引用
   *
   *  注意确认好该段代码执行时候目标对象已准备就绪.
   *
   ***************************************************************/
  import _comInst from './lib/_common/instance';
  import { ToolController } from './lib/controller/ToolController.ts';

  let iP = setInterval(() => {
    if (_comInst.controller.PlatformController) {
      let platformController       = _comInst.controller.PlatformController,
          toolController           = _comInst.controller.ToolController;
      platformController._platform = document.getElementById('mcr-platform');

      if (toolController === null) {
        _comInst.controller.ToolController = new ToolController();
      }

      clearInterval(iP);
      em.emit('event/log/trace', { step: '初始化PlatformController' });
    }
  }, TIME_SECONDS);

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
    methods   : {
      onContainerMouseout (e) {
        em.emit('request/scene', { action: 'set', arg: { afk: true } });
        em.emit('event/log/trace', { step: `请求终止渲染` });
      },
      onContainerMouseover (e) {
        em.emit('request/scene', { action: 'set', arg: { afk: false } });
        em.emit('event/log/trace', { step: `请求启动渲染` });
      }
    }
  };

</script>
