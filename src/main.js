import Vue from 'vue';
import stores from 'vue-stores';
import './lib';
import em from './lib/bus';

import(/* webpackChunkName: "trace" */'./lib/trace/index');

/** ************************************************
 *
 *          引用一些自动完成自我初始化的模块
 *
 ***************************************************/
import ('./lib/listener/index.ts');

// require('babel-core/register');
// require('babel-polyfill');

Vue.config.productionTip = false;
Vue.use(stores);

/** ************************************
 * 注册全局组件
 ***************************************/
import ComIconSvg from './lib/view/util/ComIconSvg.vue';
import ComIconFont from './lib/view/util/ComIconFont.vue';

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
                  current  : {
                    status: '全局状态提示',
                    camera: {
                      position : { x: 0, y: 0, z: 0 },
                      direction: { x: 0, y: 0, z: 0 }
                    },
                    point : { x: 0, y: 0, z: 0 }
                  },
                  menu     : {
                    base   : [
                      {
                        title        : '全屏',
                        icon         : 'msign-zoomout',
                        isToggle     : true,
                        isActive     : false,
                        callbackClick: null,
                        callbackOn   : function () {
                          this.isActive = true;
                          this.icon     = 'msign-zoomin';
                          em.emit(
                              'request/container',
                              { action: 'zoomout', arg: {} }
                          );
                          em.emit('event/log/trace', { step: `请求全屏` });
                        },
                        callbackOff  : function () {
                          this.isActive = false;
                          this.icon     = 'msign-zoomout';
                          em.emit(
                              'request/tool',
                              {
                                action: 'zoomin',
                                arg   : {}
                              }
                          );
                          em.emit('event/log/trace', { step: `请求取消全屏` });
                        }
                      },
                      {
                        title        : '相机归位',
                        icon         : 'msign-home',
                        isToggle     : false,
                        isActive     : false,
                        callbackClick: function () {
                          em.emit(
                              'request/camera',
                              { action: 'reset', arg: {} }
                          );
                          em.emit('event/log/trace', { step: `请求相机归位` });
                        },
                        callbackOn   : null,
                        callbackOff  : null
                      },
                      {
                        title        : '截图',
                        icon         : 'msign-camera',
                        isToggle     : false,
                        isActive     : false,
                        callbackClick: function () {
                          em.emit(
                              'request/tool',
                              { action: 'prtscn', arg: {} }
                          );
                          em.emit('event/log/trace', { step: `请求截屏` });
                        },
                        callbackOn   : null,
                        callbackOff  : null
                      }
                    ],
                    primary: [
                      {
                        title: '默认按钮',
                        icon : 'msign-copyright'
                      }
                    ],
                    advance: []
                  },
                  customize: {
                    right: null
                  },
                  setting  : {
                    isDebug: false
                  },
                  ui       : {}
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
