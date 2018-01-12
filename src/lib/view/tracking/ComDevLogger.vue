<template>
    <div class="com-dev-logger">
        <ul class="list full-height full-width">
            <li class="list-item" v-for="(ctx, i) in ctxs">
                <div class="input-group">
                    <h5 :class="{'red':i===ctxs.length-1}">{{ctx}}</h5>
                </div>
            </li>
        </ul>
    </div>
</template>
<style scoped="">
    .red {
        color: red;
    }

    .list {
        list-style: none;
        padding: 2px;
    }

    .com-dev-logger {
        background-color: transparent;
        overflow-y: hidden;
    }
</style>
<script>
  import em from '../../bus';
  import lang from '../../lang';

  em.on('event/log/trace', (msg) => {
    if (vm.ctxs.length > 10) {
      vm.ctxs.shift();
    }
    vm.ctxs.push(`${lang.logger_event_log_trace_F()}.\t${ JSON.stringify(msg) }`);
  });

  let vm = {
    ctxs: []
  };

  export default {
    components: {},
    data () {
      return vm;
    },
    methods   : {},
    mounted   : function () {
      em.emit('event/log/trace', { step: '调试组件启动' });
    }
  };
</script>
