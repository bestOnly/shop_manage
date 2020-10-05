<template>
  <div>
    首页
    <el-button @click="logout">退出</el-button>
  </div>
</template>

<script>
import session from '@/utils/session'
export default {
  methods: {
    logout() {
      session.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped></style>
