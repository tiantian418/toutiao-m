<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <van-search
      v-model="searchText"
      show-action
      background="#3296fa"
      placeholder="请输入搜索关键词"
      @search="onSearch(searchText)"
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
      @search="onSearch"
      :search-text="searchText"
    />

    <!-- 历史记录 -->
    <search-history
      v-else
      :search-histories="searchHistories"
      @search="onSearch"
      @update-histories="searchHistories = $event"
    />
  </div>
</template>
<script>
import SearchSuggestion from './components/search-suggestion'
import SearchHistory from './components/search-history'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'
// import { getSearchHistories } from '@/api/search'
import { mapState } from 'vuex'

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
      isResultShow: false, // 控制搜索结果的显示状态
      searchHistories: getItem('search-histories') || [] // 搜索历史记录
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {
    // 监视搜索历史记录的变化,存储到本地
    searchHistories () {
      setItem('search-histories', this.searchHistories)
    }
  },
  created () {
    this.loadSearchHiestories()
  },
  mounted () {},
  methods: {
    onSearch (searchText) {
      // 把输入框设置为需要搜索的文本
      this.searchText = searchText

      const index = this.searchHistories.indexOf(searchText)
      if (index !== -1) {
        // 把重复项删除
        this.searchHistories.splice(index, 1)
      }

      // 把最新的搜索记录放到顶部
      this.searchHistories.unshift(searchText)

      // 展示搜索结果
      this.isResultShow = true
    },

    async loadSearchHiestories () {
      // 这里需要让后端返回的历史记录和本地的历史记录合并到一起(因为后端只储存了四条)
      // 如果用户已登录
      // let searchHistories = getItem('search-histories') || []
      // if (this.user) {
      //   const { data } = await getSearchHistories()
      //   // 合并数组： [...数组, ...数组]
      //   // 把Set转为数组：[...Set对象]
      //   // 数组去重：[...new Set([...数组, ...数组])
      //   searchHistories = [...new Set([
      //     ...searchHistories,
      //     ...data.data.keywords
      //   ])]
      // }

      const searchHistories = getItem('search-histories') || []

      this.searchHistories = searchHistories
    }
  }
}
</script>
<style scoped lang='less'>
.van-search__action {
  color: #fff;
}
</style>
