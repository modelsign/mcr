<template>
    <div>
        <ul class="tag-list">
            <li v-for="tag in _tags">{{tag}}</li>
        </ul>
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
    ul.tag-list {
        list-style: none;
        position: absolute;
        top: 100%;
        margin: 0;
        margin-top: -1em;
        padding: 0 4px;
        height: 1em;
        right: 0;
        background: #fbf8daa8;

        display: flex;
    }

    ul.tag-list li {
        align-self: center;
    }
</style>
