<template>
    <div class="tag-list">
        <span v-for="tag in _tags">{{tag}}</span>
    </div>
</template>

<script>
  export default {
    name    : 'ms-dev-label',
    props   : ['tags', 'tag'],
    data () {
      return {};
    },
    computed: {
      _tags () {
        return this.tags || [this.tag];
      }
    },
    mounted () {

    }
  };
</script>

<style scoped>
    div.tag-list {
        list-style: none;
        /*position: absolute;*/
        top: 100%;
        margin: 0;
        margin-top: -1em;
        padding: 0 4px;
        height: 1em;
        right: 0;
        background: #fbf8daa8;

        display: flex;
    }

    div.tag-list span {
        align-self: center;
    }
</style>
