<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="van-nav-bar"
      title="文章详情"
      left-arrow
      @click="$router.back()"
    />

    <!-- 标题 -->
    <h1 class="title">{{ article.title }}</h1>

    <!-- 头像和作者名称 -->
    <van-cell center class="user-info">
      <div slot="title" class="name">{{ article.aut_name }}</div>
      <van-image
        slot="icon"
        class="avatar"
        fit="cover"
        round
        :src="article.aut_photo"
      />
      <!-- 时间 -->
      <div slot="label" class="pubdate">{{ article.pubdate | relativeTime }}</div>
      <!-- 按钮 -->
      <van-button
        class="follow-btn"
        round
        :type="article.is_followed ? 'default' : 'info'"
        :icon="article.is_followed ? '' : 'plus'"
        size="small"
      >{{ article.is_followed ? '已关注' : '关注' }}</van-button>
    </van-cell>

    <!-- 正文内容 -->
    <div class="markdown-body" v-html="article.content"></div>
  </div>
</template>

<script>
import './github-markdown.css'
import { getArticleById } from '@/api/article'

export default {
  name: 'ArticleIndex',
  components: {},
  props: {
    articleId: {
      type: [Number, Object, String],
      required: true
    }
  },
  data () {
    return {
      article: {} // 文章数据对象
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () {},
  methods: {
    async loadArticle () {
      const { data } = await getArticleById(this.articleId)
      this.article = data.data
    }
  }
}
</script>

<style scoped lang='less'>
.title {
  font-size: 20px;
  color: #3a3a3a;
  padding: 24px 20px 18px;
  background-color: #fff;
  margin: 0;
}
.user-info {
  .avatar {
    width: 35px;
    height: 35px;
    margin-right: 8px;
  }
  .name {
    font-size: 12px;
    color: #333;
  }
  .pubdate {
    font-size: 14px;
    color: #b4b4b4;
  }
  .follow-btn {
    width: 85px;
    height: 29px;
  }
}
ul {
  list-style: unset;
}

.markdown-body {
  padding: 14px;
  background-color: #fff;
}
</style>
