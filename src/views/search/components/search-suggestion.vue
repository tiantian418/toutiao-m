<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(str, index) in suggestions"
      :key="index"
      @click="$emit('search', str)"
    >
      <div slot="title" v-html="highlight(str)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
// 按需加载
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: [], // 联想建议数据列表
      htmlStr: 'Hello <span style="color: red">World</span>'
    }
  },
  computed: {},
  watch: {
    // 监视的完整写法
    searchText: {
      // 当数据发生变化则会执行handler处理函数
      // debounce: 防抖 参数1:函数 参数2:时间 返回值:防抖处理的函数
      handler: debounce(async function () {
        const { data } = await getSearchSuggestions(this.searchText)
        this.suggestions = data.data.options
      }, 200),
      // 该回调将会在侦听开始之后被立即调用
      immediate: true
    }
  },
  created () {},
  mounted () {},
  methods: {
    highlight (str) {
      // RegExp 是正则表达式的构造函数 参数1:字符串 参数2:匹配模式 返回值:正则对象
      return str.replace(
        new RegExp(this.searchText, 'gi'), // gi:全局匹配,忽略大小写
        `<span style="color:red">${this.searchText}</span>`
      )
    }
  }
}
</script>

<style scoped lang='less'>
</style>
