<template>
    <div>
        <ul>
            <transition-group name="list" tag="p">
                <li
                        :key="JSON.stringify(item)"
                        v-for=" (item, index) in logs"
                        class="list-item"
                >
                    <span :style="{'color':index===logs.length-1?'red':'green'}">{{`[${item.from}][${time2str(item.timestamp)}] ${item.ctx}`}}</span>
                </li>
            </transition-group>
        </ul>
    </div>
</template>

<script>
  import moment from 'moment';

  import global from '../../../core/Global';

  export default {
    name   : 'com-layer-screen',
    data () {
      return {
        tick_last: 0,
        logs     : [
          {
            from     : '来源模块',
            ctx      : '正文1',
            timestamp: 0
          }
        ]
      };
    },
    methods: {
      time2str (t) {
        return moment(t).format('LLLL');
      }
    },
    mounted () {
      let { bus } = global;
      bus.on('core/tick', (t) => {
        let tick_last = this.tick_last;
        if (t - tick_last > 10000 / this.logs.length + 1) {
          this.logs.splice(0, 1);
          this.tick_last = t;
        }
      });
      bus.on('log', ({ event, args }) => {
        if (this.logs.length > 20) {
          this.logs.splice(0, 1);
        }
        this.logs.push(
            {
              from     : '来源模块',
              ctx      : args,
              timestamp: Date.now()
            }
        );
      });
    }
  };
</script>

<style scoped>
    ul {
        list-style: none;
    }

    .list-item {
        transition: all 1s ease;
    }

    .list-leave-active {
        position: absolute;
        transition: all 1s ease;
    }

    .list-leave-to {
        opacity: 0;
        transform: translateY(-30px);
    }

    .list-enter {
        opacity: 0;
        transform: translateY(30px);
    }

</style>
