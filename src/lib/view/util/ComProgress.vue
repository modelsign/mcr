<template>
    <div class="progress">
        <transition-group name="list" tag="p">
            <div
                    v-if="p.progress<1"
                    v-for="p in progressList"
                    :key="p.id"
                    class="progress-item" :style="{'width':`${p.progress*100}%`}">
            </div>
        </transition-group>
    </div>
</template>
<style scoped="">

    .progress {
        position: absolute;
        background-color: transparent;
        left: 0;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    }

    .progress-item {
        margin: 1px 0 2px 0;
        padding: 0;
        height: 2px;
        background-color: #6ed8ff;
        box-shadow: 4px 0 0 #ff002b;
    }

    .list-enter-active, .list-leave-active {
        transition: all 0.5s;
    }

    .list-enter, .list-leave-to {
        opacity: 0;
        transform: translateY(30px);
    }

</style>
<script>
  import TWEEN from '@tweenjs/tween.js';
  import em from '../../bus';

  let tProgressMap = {};
  export default {
    components: {},
    data () {
      return {
        progressList: []
      };
    },
    stores    : {
      stateCurrentIsProcessing: 'state.current.isProcessing'
    },
    methods   : {
      onProgressUpdate ({ id, progress }) {
        this.stateCurrentIsProcessing = progress < 1;

        let p         = this.progressList.find(({ id: _id }) => {return id === _id;}) ||
                        this.progressList[this.progressList.push({ id, progress }) - 1];
        let tProgress = tProgressMap[id] || (
            tProgressMap[id] = new TWEEN.Tween(p)
        );
        tProgress.stop();
        tProgress
            .easing(TWEEN.Easing.Quadratic.InOut)
            .to({ progress }, 100)
            .onComplete(() => {
              if (progress === 1) {
                this.progressList.splice(this.progressList.indexOf(p), 1);
              }
            })
            .start();
      }
    },
    mounted   : function () {
      em.on('event/ui/progress', this.onProgressUpdate);
    }
  };
</script>
