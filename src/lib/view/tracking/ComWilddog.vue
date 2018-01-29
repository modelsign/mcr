<template>
    <div v-if="stateSettingISDebug">
        <span>设备编号:{{fingerprint}}</span>
        <span>会话编号:{{scope}}</span>
    </div>
</template>
<style>

</style>
<script>
  const fingerprint = _comInst.state.current.fingerprint;
  const UA          = require('ua-device');

  let ua        = new UA(navigator && navigator.userAgent);
  const WildVue = require('wildvue');
  const Wilddog = require('wilddog');

  import Vue from 'vue';
  import _comInst from '../../_common/instance';
  import em from '../../bus';

  Vue.use(WildVue);

  let config     = {
    syncURL      : 'https://wd3650142552xwmlzf.wilddogio.com',
    websocketOnly: false,
    authDomain   : 'wd3650142552xwmlzf.wilddog.com'
  };
  let wilddogApp = Wilddog.initializeApp(config);
  let sync       = wilddogApp.sync();

  _comInst.wild.sync = sync;

  export default {
    components: {},
    data () {
      return {
        fingerprint,
        scope: ''
      };
    },
    stores    : {
      stateSettingISDebug     : 'state.setting.isDebug',
      stateCurrentIsProcessing: 'state.current.isProcessing',
      stateCurrentFingerprint : 'state.current.fingerprint'
    },
    wilddog   : {
      /**
       *
       */
      wdGlobalRef : sync.ref('global'),
      wdSessionRef: sync.ref(`session/${fingerprint}`)
    },
    methods   : {},
    mounted   : async function () {
      let localTime = new Date();
      let device    = `session/${fingerprint}`;
      let scope     = `${device}/${localTime.getTime()}`;
      this.scope    = localTime.getTime();

      sync.child(`${scope}/startup`).set(localTime.toUTCString());
      sync.child(`${device}/UserAgent`).update(ua);

      em.on('event/log/trace', ({ step }) => {
        if (_comInst.state.setting.isDebug) {
          let localTime = new Date();
          sync.child(`${scope}/trace/${localTime.toUTCString()}/${localTime.getMilliseconds()}`)
              .set(step);
        }
      });
      this.stateCurrentFingerprint = fingerprint;
    }
  };
</script>
