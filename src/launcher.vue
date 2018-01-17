<template>
    <div>
        <h1 v-if="!app">加载中</h1>
        <component :is="app"/>
    </div>
</template>
<style>

</style>
<script>


  export default {
    components: {},
    data () {
      return {
        app: null
      };
    },
    methods   : {},
    mounted   : async function () {
      import(/* webpackChunkName: "app" */'./app.vue')
          .then((app) => {
            this.app = app;
          });
    }
  };
</script>
