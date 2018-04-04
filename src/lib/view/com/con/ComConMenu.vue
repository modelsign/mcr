<template>
    <div>
        <ul>
            <li v-for="menu in menus">
                <com-util-icon-svg :icon="menu.icon"></com-util-icon-svg>
            </li>
        </ul>
    </div>
</template>

<script>
  import ComUtilIconSvg from 'src/lib/view/com/util/ComUtilIconSvg';

  export default {
    components: { ComUtilIconSvg },
    name      : 'com-con-menu',
    props     : ['menus']
  };

</script>

<style scoped>

</style>
