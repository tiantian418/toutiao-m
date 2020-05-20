<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="van-nav-bar"
      title="文章详情"
      left-arrow
      @click="$router.back()"
    />

    <div class="article-wrap">
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
          :loading="isFollowLoading"
          @click="onFollow"
        >{{ article.is_followed ? '已关注' : '关注' }}</van-button>
      </van-cell>
      <!-- 正文内容 -->
      <div
        class="markdown-body"
        v-html="article.content"
        ref="article-content"
      ></div>
      <!-- 文章评论列表 -->
      <comment-list :source="articleId" />
    </div>

    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="isPostShow = true"
      >写评论</van-button>
      <van-icon
        name="comment-o"
        info="totalCommentCount"
        color= "#777"
      />
      <van-icon
        :color="article.is_collected ? 'orange' : '#777'"
        :name="article.is_collected ? 'star' : 'star-o'"
        @click="onCollect"
      />
      <van-icon
        :color="article.attitude === 1 ? 'hotpink' : '#777'"
        :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
        @click="onLike"
      />
      <van-icon name="share" color="#777"></van-icon>
    </div>
  </div>
</template>

<script>
import './github-markdown.css'
import { getArticleById, addCollect, deleteCollect, addLike, deleteLike } from '@/api/article'
import { ImagePreview } from 'vant'
import { addFollow, deleteFollow } from '@/api/user'
import CommentList from './components/comment-list'

export default {
  name: 'ArticleIndex',
  components: {
    CommentList
  },
  props: {
    articleId: {
      type: [Number, Object, String],
      required: true
    }
  },
  data () {
    return {
      article: {}, // 文章数据对象
      isFollowLoading: false,
      isCollectLoading: false
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

      // this.$nextTick是vue土工的方法
      this.$nextTick(() => {
        this.handlePerviewImage()
      })
    },

    handlePerviewImage () {
      // 1.获取文章内容DOM容器
      const articleContent = this.$refs['article-content']

      // 2.得到所有的img标签
      const imgs = articleContent.querySelectorAll('img')
      const imgPaths = [] // 收集所有的图片路径

      // 3.循环img列表,给img注册点击事件
      imgs.forEach((img, index) => {
        imgPaths.push(img.src)
        img.onclick = function () {
          // 4.在事件处理函数中调用ImagePreview()预览
          ImagePreview({
            images: imgPaths, // 图片预览路径
            startPosition: index // 起始位置
          })
        }
      })
    },

    async onFollow () {
      // 开启按钮的 loading 状态
      this.isFollowLoading = true
      if (this.article.is_followed) {
        // 如果已关注，则取消关注
        await deleteFollow(this.article.aut_id)
      } else {
        // 否则添加关注
        await addFollow(this.article.aut_id)
      }

      // 更新视图
      this.article.is_followed = !this.article.is_followed

      // 关闭按钮的 loading 状态
      this.isFollowLoading = false
    },

    async onCollect () {
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true // 禁止背景点击
      })
      if (this.article.is_collected) {
        // 已收藏，取消收藏
        await deleteCollect(this.articleId)
      } else {
        // 没有收藏，添加收藏
        await addCollect(this.articleId)
      }
      this.article.is_collected = !this.article.is_collected
      this.$toast.success(`${this.article.is_collected ? '' : '取消'}收藏成功`)
    },

    async onLike () {
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true // 禁止背景点击
      })
      if (this.article.attitude === 1) {
        // 如果已点赞，则取消点赞
        await deleteLike(this.articleId)
        this.article.attitude = -1
      } else {
        // 否则添加点赞
        await addLike(this.articleId)
        this.article.attitude = 1
      }

      // 更新视图
      this.$toast.success(`${this.article.attitude === 1 ? '' : '取消'}点赞成功`)
    }
  }
}
</script>

<style scoped lang='less'>
.article-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 46px;
  bottom: 44px;
  overflow-y: auto;
}
.van-nav-bar {
  background-color: #3296fa;
}
/deep/ .van-nav-bar__title {
  color: #fff;
}
/deep/ .van-icon {
  color: #fff;
}
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
.article-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  height: 44px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .comment-btn {
    width: 141px;
    height: 23px;
    border: 1px solid #eeeeee;
    font-size: 15px;
    line-height: 23px;
    color: #a7a7a7;
  }
  .van-icon {
    font-size: 20px;
    .van-info {
      font-size: 11px;
      background-color: #e22829;
    }
  }
}
</style>
