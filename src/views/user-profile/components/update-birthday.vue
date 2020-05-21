<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      :min-date="minDate"
      :max-date="maxDate"
       @cancel="$emit('close')"
       @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'

export default {
  name: 'UpdateBirthday',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true
      })

      const date = dayjs(this.currentDate).format('YYYY-MM-DD')

      // 更新用户生日
      await updateUserProfile({
        birthday: date
      })

      // 改变父组件中的birthday
      this.$emit('input', date)

      // 关闭弹出层
      this.$emit('close')

      this.$toast.success('保存成功')
    }
  }
}
</script>

<style scoped lang='less'>
</style>
