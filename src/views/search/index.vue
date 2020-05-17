<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <van-search
      v-model="searchText"
      show-action
      background="#3296fa"
      placeholder="请输入搜索关键词"
      @search="onSearch"
      @cancel="$router.back()"
    />

    <!-- 智能联想 -->
    <search-suggestion />

    <!-- 历史记录 -->
    <search-history />

    <!-- 搜索结果 -->
    <search-result />
  </div>
</template>
<script>
import SearchSuggestion from './components/search-suggestion'
import SearchHistory from './components/search-history'
import SearchResult from './components/search-result'

export default {
  name: 'SearchIndex',
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResult
  },
  props: {},
  data () {
    return {
      searchText: '' // 搜索输入框的内容
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onSearch () {
      console.log('onSearch')
    }
  }
}
</script>
<style scoped lang='less'>
</style>
