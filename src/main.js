import Vue from 'vue';
import stores from 'vue-stores';
import './lib';
import em from './lib/bus';

import _comInst from './lib/_common/instance';

/** ************************************
 * 注册全局组件
 ***************************************/
import ComIconSvg from './lib/view/util/ComIconSvg.vue';
import ComIconFont from './lib/view/util/ComIconFont.vue';

(
    function () {
      
      /** ************************************************
       *
       *          引用一些自动完成自我初始化的模块
       *
       ***************************************************/
      import(/* webpackChunkName: "trace" */'./lib/trace/index');
      import (/* webpackChunkName: "listener" */'./lib/listener/index.ts');
      
      // require('babel-core/register');
      // require('babel-polyfill');
      
      Vue.config.productionTip = false;
      Vue.use(stores);
      
      Vue.component('ComIconSvg', ComIconSvg);
      Vue.component('ComIconFont', ComIconFont);
      
      em.emit('event/log/trace', { step: '程序启动' });
      
      // import App from './app.vue';
      const promiseLauncher = import(/* webpackChunkName: "launcher" */'./launcher.vue');
      const promiseApp = import(/* webpackChunkName: "app" */'./app.vue');
      
      window['msign'] = {
        create (domElement) {
          new Vue(
              {
                el        : domElement,
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
                template  : '<m-app />',
                components: { MApp: () => promiseApp },
                mounted () {
                  setTimeout(() => {
                    window.msign = _comInst;
                  }, TIME_SECONDS);
                }
              }
          );
          
        }
      };
      
    }
)();
