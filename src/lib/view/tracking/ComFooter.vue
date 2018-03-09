<template>
    <div class="row footer">
        <div class="title full-width">
            <com-progress></com-progress>
            <div class="col-md-3">
                <div>
                    <com-icon-svg v-if="stateSettingIsDebug" icon="msign-console" class=""></com-icon-svg>
                    <com-icon-svg v-if="!stateSettingIsDebug" icon="msign-lightning" class=""></com-icon-svg>
                    {{stateCurrentStatus}}
                </div>
            </div>
            <div class="col-md-6">
                <div>
                    <span>
                        <small>
                            <com-icon-svg icon="msign-eye" class=""></com-icon-svg>
                        {{`${stateCurrentCamera.position.x.toFixed(0)},
                         \t${stateCurrentCamera.position.y.toFixed(0)},
                         \t${stateCurrentCamera.position.z.toFixed(0)}\t`}}&nbsp;
                        </small>
                        <small>
                            <com-icon-svg icon="msign-location" class=""></com-icon-svg>
                        {{`${computeCursor.x.toFixed(0)},
                         \t${computeCursor.y.toFixed(0)},
                         \t${computeCursor.z.toFixed(0)}\t`}}&nbsp;
                        </small>
                    </span>
                </div>
            </div>
            <div class="col-md-3">
                <div style="white-space:nowrap;text-align: right">
                    <span>
                        <com-icon-svg icon="msign-users" class=""></com-icon-svg>
                        {{stateGlobalOnline}}
                    </span>
                    &nbsp;&nbsp;
                    <a href="//mcr.msign.tech/" target="_blank">
                        <com-icon-svg icon="msign-documentation" class=""></com-icon-svg>
                        帮助文档
                    </a>
                    &nbsp;&nbsp;
                    <a href="mailto:support@msign.net" target="_blank">
                        <com-icon-svg icon="msign-mailing" class=""></com-icon-svg>
                        邮件支持
                    </a>
                </div>
                <!--<span>2018</span>-->
            </div>
        </div>
        <div class="row ext full-width">
            <div>
                <table class="table">
                    <thead>
                    <tr>
                        <td>调试模式</td>
                        <td></td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            <button @click="()=>{stateSettingIsDebug=!stateSettingIsDebug}"
                                    class="btn btn-sm btn-warning">{{stateSettingIsDebug}}
                            </button>
                        </td>
                        <td>
                            <com-wilddog></com-wilddog>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<style scoped="">
    .footer {
        pointer-events: all;
        position: absolute;
        width: 100%;
        height: 24px;
        margin: 0;
        margin-top: -24px;
        top: 100%;
        right: 0;
        padding: 0;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        align-content: flex-start;

        background: linear-gradient(90deg, transparent, rgba(128, 128, 128, 0.5));
        box-shadow: 0 -2px 0 rgba(0, 0, 0, .3);
        /*color: hsla(0, 0%, 100%, .4);*/
        color: inherit;
        font-size: 12px;
        transition: all 0.1s ease-in-out;
    }

    .title {
        width: 100%;
        height: 24px;
        margin: 0;
        padding: 0 2px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        box-shadow: 0 1px 0 #999;
    }

    .footer > .ext {
        display: none;
    }

    .footer:hover {
        height: 128px;
        margin-top: -128px;
    }

    .footer:hover > .ext {
        padding: 4px 24px;
        display: flex;
        flex-direction: row;
        justify-items: flex-start;
        justify-content: flex-start;
        align-items: flex-start;
    }

    a:link {
        color: #252525;
        text-decoration: none;
    }

    a:visited {
        color: #252525;
        text-decoration: none;
    }

    a:hover {
        color: #537a62;
        text-decoration: underline;
    }

    a:active {
        color: #252525;
        text-decoration: none;
    }
</style>
<script>
  import em from '../../bus';
  import _comInst from '../../_common/instance';

  import ComProgress from '../util/ComProgress.vue';
  import ComWilddog from './ComWilddog.vue';

  export default {
    components: { ComProgress, ComWilddog },
    data () {
      return {};
    },
    computed  : {
      computeCursor () {
        return _comInst.graph.cursor || { x: 0, y: 0, z: 0 };
      }
    },
    stores    : {
      stateCurrentStatus     : 'state.current.status',
      stateCurrentCamera     : 'state.current.camera',
      stateCurrentFingerprint: 'state.current.fingerprint',
      stateGlobalOnline      : 'state.global.online',
      stateSettingIsDebug    : 'state.setting.isDebug'
    },
    methods   : {},
    mounted   : function () {
      em.on('scene/camera/update', (camera) => {
        let position  = camera.position,
            direction = camera.getWorldDirection();
        if (position) {
          this.stateCurrentCamera.position = {
            x: position.x.toFixed(2) * 1,
            y: position.y.toFixed(2) * 1,
            z: position.z.toFixed(2) * 1
          };
        }
        if (direction) {
          this.stateCurrentCamera.direction = {
            x: direction.x.toFixed(2) * 1,
            y: direction.y.toFixed(2) * 1,
            z: direction.z.toFixed(2) * 1
          };
        }
      });

      em.on('event/log/trace', ({ step }) => {
        this.stateCurrentStatus = step;
      });
    }
  };
</script>
