<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isRefreshLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      :success-duration="1500"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell
          v-for="(article, index) in articles"
          :key="index"
          :title="article.title"
        />
       </van-list>
     </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'

export default {
  name: 'ArticleList',
  components: {},
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      articles: [], // 数据列表
      loading: false, // 控制加载中的loading状态
      finished: false, // 控制加载结束的状态
      timestamp: null, // 获取下一页数据的时间戳
      isRefreshLoading: false, // 下拉刷新的loading状态
      refreshSuccessText: '' // 下拉刷新成功的文本提示
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      console.log('onLoad')
      // 1.请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id, // 频道ID
        timestamp: this.timestamp || Date.now(), // 时间戳
        with_top: 1 // 是否包含置顶
      })

      // 2.把数据放到list中 (是push进去的)
      const { results } = data.data
      this.articles.push(...results)

      // 3.设置本次加载状态结束 (判断是否需要下一次加载)
      this.loading = false

      // 4.数据全部加载完成
      if (results.length) {
        // 更新获取下一页的代码
        this.timestamp = data.data.pre_timestamp
      } else {
        // 无数据的时候,把加载状态设置结束,不再触发加载更多
        this.finished = true
      }
    },

    async onRefresh () {
      // 1.请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id,
        timestamp: Date.now(),
        with_top: 1
      })

      // 2.把数据放到数据列表中 (往顶部追加)
      const { results } = data.data
      this.articles.unshift(...results)

      // 3.关闭刷新的loading状态
      this.isRefreshLoading = false

      this.refreshSuccessText = `更新了${results.length}条数据`
    }
  }
}
</script>

<style scoped lang='less'>
.article-list {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 50px;
  top: 90px;
  overflow-y: auto;
}
</style>
