<template>
  <div class="login-container">
    <van-nav-bar
      class="app-nav-bar"
      title="注册 / 登录"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 登录表单 -->
    <van-form
      @submit="onLogin"
      @failed="onFailed"
      validate-first
      ref="login-form"
      :show-error="false"
      :show-error-message="false">
      <van-field
        v-model="user.mobile"
        name="mobile"
        icon-prefix="toutiao"
        left-icon="shouji"
        center
        placeholder="请输入手机号"
        :rules="formRules.mobile"
      />
      <van-field
        v-model="user.code"
        name="code"
        icon-prefix="toutiao"
        left-icon="yanzhengma"
        center
        clearable
        placeholder="请输入验证码"
        :rules="formRules.code"
      >
        <template #button>
          <van-count-down
          v-if="isCountDownShow"
          :time="1000 * 60"
          format="ss s"
          @finish="isCountDownShow = false"
          />
          <van-button
          v-else
          class="send-btn"
          size="mini"
          round
          :loading="isSendSmsLoading"
          @click="onSendSms"
          >发送验证码</van-button>
        </template>
      </van-field>
      <!-- 登录按钮 -->
      <div class="login-btn-wrap">
        <van-button
        class="login-btn"
        type="info"
        block
        @click="onLogin()"
        >登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
// import { Toast } from 'vant'

export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      formRules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3|5|7|8]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isCountDownShow: false, // 控制倒计时和发送按钮的显示状态
      isSendSmsLoading: false // 控制发送验证码的loading状态
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLogin () {
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 展示时长(ms)，值为 0 时，toast 不会消失
      })
      // 请求调用登录
      try {
        const res = await login(this.user)
        // 处理响应结果
        console.log(res)
        this.$toast.success('登录成功')
      } catch (err) {
        console.log(err)
        this.$toast.fail('登录失败,手机号或验证码错误')
      }
    },

    onFailed (error) {
      if (error.errors[0]) {
        this.$toast({
          message: error.errors[0].message,
          position: 'top' // 验证规则位置 (防止手机键盘太高,看不见提示信息)
        })
      }
    },

    async onSendSms () {
      try {
        // 验证手机号码
        await this.$refs['login-form'].validate('mobile')
        // 验证通过,请求发送验证码
        this.isSendSmsLoading = true
        await sendSms(this.user.mobile)
        // 隐藏发送按钮,显示倒计时
        this.isCountDownShow = true
      } catch (err) {
        // try里面任何代码的错误都会进入到catch
        let message = ''
        if (err && err.response && err.response.status === 429) {
          // 发送短信失败的错误提示
          message = '发送太频繁,请稍后重试'
        } else if (err.name === 'mobile') {
          // 表单验证失败的错误提示
          message = err.message
        } else {
          // 未知错误
          message = '发送失败,请稍后重试'
        }
        // 用户提示
        this.$toast({
          message,
          position: 'top'
        })
      }
      this.isSendSmsLoading = false
    }
  }
}
</script>

<style scoped lang='less'>
.login-container {
  .send-btn {
    width: 76px;
    height: 23px;
    background-color: #ededed;
    .van-button__text {
    font-size: 11px;
    color: #666666;
    }
  }
}
.login-btn-wrap {
  padding: 26px 16px;
  .login-btn {
    background-color: #6db4fb;
    border: none;
    .van-button__text {
      font-size: 15px;
    }
  }
}
</style>
