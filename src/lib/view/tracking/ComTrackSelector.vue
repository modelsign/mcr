<template>
    <div class="select-bg"
         @mousedown="onMousedown"
         @mousemove="onMousemove"
         @mouseup="onMouseup"
         v-if="stateCurrentInteraction==='select'"
    >
        <div
                class="select-rectangle"
                v-show="selectRec.isActive"
                :style="{
                    'top':`${selectRec.top}px`,
                    'left':`${selectRec.left}px`,
                    'width':`${selectRec.width}px`,
                    'height':`${selectRec.height}px`
                }"
        ></div>
        <div class="selected"
             v-if="stateSettingIsDebug"
        >
            <div class="selected-item" v-for="item in selected"
                 :style="{
                    'top':`${item.p.y}px`,
                    'left':`${item.p.x}px`
                 }"
            >
                <span>{{item.m.name}}</span>
            </div>
        </div>
    </div>
</template>
<style scoped="">
    .select-bg {
        pointer-events: auto;
        position: absolute;
        top: 0;
        margin: 2px;
        width: calc(100% - 4px);
        height: calc(100% - 4px);
        /*border-color: lightskyblue;*/
        /*border-width: 1px;*/
        /*border-style: dashed;*/
        /*border-radius: 2px;*/
    }

    .selected-item {
        pointer-events: none;
        position: absolute;
        width: 4px;
        height: 4px;
        background-color: #ff0000;
    }

    .select-rectangle {
        pointer-events: none;
        position: absolute;
        background-color: rgba(170, 232, 250, 0.33);

        /*border-radius: 2px;*/
        border-style: double;
        border-width: 1px;
        border-color: rgba(119, 119, 119, 0.52);
    }
</style>
<script>
  import _comInst from '../../_common/instance';
  import em from '../../bus';

  const THREE = require('../../../../vender/three');

  export default {
    components: {},
    data () {
      return {
        selectRec: {
          isActive: false,
          hitX    : 0,
          hitY    : 0,
          top     : 0,
          left    : 0,
          width   : 0,
          height  : 0
        },
        selected : []
      };
    },
    stores    : {
      stateSettingIsDebug    : 'state.setting.isDebug',
      stateCurrentInteraction: 'state.current.interaction',
      stateCurrentSelects    : 'state.current.selects'
    },
    methods   : {
      onMousedown (event) {
        let { layerX, layerY, button } = event;
        if (button !== 0) {
          return;
        }
        this.selectRec.isActive = true;
        this.hitX               = layerX;
        this.hitY               = layerY;
        this.selectRec.top      = layerY;
        this.selectRec.left     = layerX;
        this.selectRec.width    = 0;
        this.selectRec.height   = 0;

      },
      onMousemove (event) {
        let { layerX, layerY } = event;

        if (layerX > this.hitX) {
          this.selectRec.width = layerX - this.selectRec.left;
        } else {
          this.selectRec.left  = layerX;
          this.selectRec.width = this.hitX - layerX;
        }
        if (layerY > this.hitY) {
          this.selectRec.height = layerY - this.selectRec.top;
        } else {
          this.selectRec.top    = layerY;
          this.selectRec.height = this.hitY - layerY;
        }
      },
      onMouseup (event) {
        this.select();
        this.selectRec.isActive = false;
        this.selectRec.hitX     = 0;
        this.selectRec.hitY     = 0;
        this.selectRec.top      = 0;
        this.selectRec.left     = 0;
        this.selectRec.width    = 0;
        this.selectRec.height   = 0;
      },
      select () {
        let { camera, scene, renderer } = _comInst.graph;
        let meshs                       = scene
            .children
            .filter(
                (object3d) => {
                  return object3d instanceof THREE.Mesh &&
                         object3d.name.indexOf('h-') !== 0
                      ;
                }
            );

        let halfW = renderer.domElement.getBoundingClientRect().width / 2,
            halfH = renderer.domElement.getBoundingClientRect().height / 2;

        this.selected = [];
        meshs.forEach((mesh, index) => {
          mesh.geometry.computeBoundingSphere();
          let pWorld  = mesh.geometry
                            .boundingSphere
                            .center
                            .clone()
                            .add(mesh.position);
          let pCamera = pWorld.project(camera);
          let pLayer  = {
            x: Math.round(pCamera.x * halfW + halfW),
            y: Math.round(-pCamera.y * halfH + halfH)
          };
          if (
              pLayer.x > this.selectRec.left && pLayer.x < this.selectRec.left + this.selectRec.width &&
              pLayer.y > this.selectRec.top && pLayer.y < this.selectRec.top + this.selectRec.height
          ) {
            this.selected.push({ p: pLayer, m: mesh });
            /** ************************************
             * debug模式下显示辅助
             ***************************************/
            if (this.stateSettingIsDebug) {
              mesh.material.wireframe = true;
              console.log(mesh);
            }
          } else {
            /** ************************************
             * debug模式下显示辅助
             ***************************************/
            if (this.stateSettingIsDebug) {
              mesh.material.wireframe = false;
            }
          }
        });
        /** ************************************
         * 整理选中后结果集
         ***************************************/
        if (this.selected.length > 0) {
          em.emit('event/log/trace', { step: `选中 ${this.selected.length} 个对象` });
        }
        this.stateCurrentSelects = this.selected;
      }
    },
    mounted   : function () {
      //      console.log('');
    }
  };
</script>
