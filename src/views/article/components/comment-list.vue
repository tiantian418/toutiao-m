<template>
  <div class="comment-list">
    <van-cell title="全部评论"></van-cell>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(comment, index) in list"
        :key="index"
        :title="comment.content"
      />
    </van-list>
  </div>
</template>

<script>
import { getComments } from '@/api/comment'

export default {
  name: 'CommentList',
  components: {},
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的页码
      limt: 10 // 每页大小
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      // 1.请求获取数据
      const { data } = await getComments({
        type: 'a', // 评论类型
        source: this.source, // 文章id或评论id
        offset: this.offset, // 获取评论数据的偏移量
        limit: this.limit // 每页大小
      })

      // 2.把数据放到列表中
      const { results } = data.data
      this.list.push(...results)

      // 3.关闭本次loading
      this.loading = false

      // 4.判断是否还有数据
      if (results.length) {
        // 如果有，更新获取下一页数据的页码
        this.offset = data.data.last_id
      } else {
        // 如果没有，则将 finished 设置为 ture，不再触发加载更多了
        this.finished = true
      }
    }
  }
}
</script>

<style scoped lang='less'>
</style>
