import Vue from 'vue';
import stores from 'vue-stores';
import './lib';
import em from './lib/bus';

import _comInst from './lib/_common/instance';

const TIME_SECONDS = 2000;
(
    () => {
      /** ************************************************
       *
       *          引用一些自动完成自我初始化的模块
       *
       ***************************************************/
      import (/* webpackChunkName: "trace" */'./lib/trace/index');
      import (/* webpackChunkName: "listener" */'./lib/listener/index.ts');
      
      // require('babel-core/register');
      // require('babel-polyfill');
      
      Vue.config.productionTip = false;
      Vue.use(stores);
      em.emit('event/log/trace', { step: '程序启动' });
      
      // import App from './app.vue';
      const promiseLauncher = import(/* webpackChunkName: "launcher" */'./launcher.vue');
      const promiseApp      = import(/* webpackChunkName: "app" */'./app.vue');
      
      window['msign'] = {
        async create (domElement) {
          let state      = {
            current  : {
              isProcessing: false,
              status      : '全局状态提示',
              camera      : {
                position : { x: 0, y: 0, z: 0 },
                direction: { x: 0, y: 0, z: 0 }
              },
              point       : { x: 0, y: 0, z: 0 },
              /**
               * orbit.   鼠标交互拖拽交互模式, 该模式下鼠标拖拽控制相机移动
               * select.  鼠标交互框选模式, 该模式下鼠标左键框选模型
               */
              interaction : 'orbit',
              selects     : []
            },
            menu     : {
              base   : [
                {
                  title        : `拖拽模式`,
                  icon         : 'msign-orbit',
                  isToggle     : false,
                  isActive     : false,
                  modes        : ['orbit', 'select'],
                  current      : 0,
                  callbackClick: function () {
                    this.current = (
                                       this.current + 1
                                   ) % this.modes.length;
                    let mode     = this.modes[this.current];
                    this.icon    = `msign-${mode}`;
                    
                    switch (mode) {
                      case 'orbit':
                        this.title = `拖拽模式`;
                        break;
                      case 'select':
                        this.title = `框选模式`;
                        break;
                    }
                    em.emit('request/tool', { action: 'inter', arg: { mode } });
                    em.emit('event/log/trace', { step: `切换交互模式[${mode}]` });
                  },
                  callbackOn   : null,
                  callbackOff  : null
                },
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
                        {
                          action: 'zoomout',
                          arg   : { isFullScreen: true }
                        }
                    );
                    em.emit('event/log/trace', { step: `请求全屏` });
                  },
                  callbackOff  : function () {
                    this.isActive = false;
                    this.icon     = 'msign-zoomout';
                    em.emit(
                        'request/container',
                        {
                          action: 'zoomin',
                          arg   : { isFullScreen: false }
                        }
                    );
                    em.emit('event/log/trace', { step: `请求取消全屏` });
                  }
                },
                {
                  title        : `相机归位`,
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
                  title        : `截图`,
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
          };
          _comInst.state = state;
          new Vue(
              {
                el        : domElement,
                data      : {
                  state
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
