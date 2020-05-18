<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span
          @click="$emit('update-histories', [])"
        >全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon
        v-else
        name="delete"
        @click="isDeleteShow = true"
      />
    </van-cell>
    <van-cell
      :title="history"
      v-for="(history, index) in searchHistories"
      :key="index"
      @click="onDeleteShow(history, index)"
    >
       <van-icon
        name="close"
        v-show="isDeleteShow"
      />
     </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false // 删除显示状态
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onDeleteShow (history, index) {
      // 删除状态.执行删除操作
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1)

        return
      }
      // 非删除状态,展示搜索结果
      this.$emit('search', history)
    }
  }
}
</script>

<style scoped lang='less'>
</style>
