import Vue from 'vue';
import stores from 'vue-stores';
import './lib';
import em from './lib/bus';

import(/* webpackChunkName: "trace" */'./lib/trace/index');

// require('babel-core/register');
// require('babel-polyfill');

Vue.config.productionTip = false;
Vue.use(stores);

/** ************************************
 * 注册全局组件
 ***************************************/
import ComIconSvg from './components/util/ComIconSvg.vue';
import ComIconFont from './components/util/ComIconFont.vue';

Vue.component('ComIconSvg', ComIconSvg);
Vue.component('ComIconFont', ComIconFont);

em.emit('event/log/trace', { step: '程序启动' });

// import App from './app.vue';
const promiseApp = import(/* webpackChunkName: "app" */'./app.vue');
if (window) {
  window.MCR = {
    create: (element) => {
      return new Promise((resolve, reject) => {
        let inst = new Vue(
            {
              el        : element,
              data      : {
                state: {
                  current: {
                    status: '全局状态提示',
                    camera: {
                      position : { x: 0, y: 0, z: 0 },
                      direction: { x: 0, y: 0, z: 0 }
                    },
                    point : { x: 0, y: 0, z: 0 }
                  },
                  setting: {
                    isDebug: false
                  },
                  ui     : {}
                }
              },
              template  : '<m-app/>',
              components: { MApp: () => promiseApp }
            }
        );
        
        /** ********************************
         * 我暂时不知道正确的API导出方式, 先这样.
         ***********************************/
        promiseApp.then(({ default: App }) => {
          App.components.LayerGraph()
             .then(({ default: LayerGraph }) => {
               let mcr = {
                 sandbox: LayerGraph.data().sandbox,
                 option : LayerGraph.data().option,
                 scene  : LayerGraph.data().scene,
                 state  : inst.state,
                 inst
               };
            
               window.MCR = mcr;
               resolve(mcr);
             });
        });
      });
    }
  };
}
