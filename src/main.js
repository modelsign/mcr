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
          let state      = _comInst.state;
          _comInst.app   = new Vue(
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
