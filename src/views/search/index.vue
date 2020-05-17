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
      @focus="isResultShow = false"
    />

    <!-- 搜索结果 -->
    <search-result
      v-if="isResultShow"
      :search-text="searchText"
    />

    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
    />

    <!-- 历史记录 -->
    <search-history v-else />
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
      searchText: '', // 搜索输入框的内容
      isResultShow: false // 控制搜索结果的显示状态
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onSearch () {
      // 展示搜索结果
      this.isResultShow = true
    }
  }
}
</script>
<style scoped lang='less'>
.van-search__action {
  color: #fff;
}
</style>
