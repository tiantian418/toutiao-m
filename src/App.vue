<template>
  <div id="app">
    <!-- 一级路由出口 -->
    <keep-alive :include="cachePages">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {
    ...mapState(['cachePages'])
  },
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style scoped lang='less'>
</style>
