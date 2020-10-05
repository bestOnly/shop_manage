<template>
  <div class="login-box">
    <div class="form-box">
      <el-form ref="form" :rules="loginRules" :model="form" label-width="0px">
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="form.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="iconfont icon-3702mima"
            v-model="form.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import '@/utils/request.js'
import session from '@/utils/session.js'

export default {
  data() {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在5-12之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6-15之间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        const { data } = await this.$http.post('login', this.form)
        session.set('token', data.data.token)
        this.$router.push('/home')
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login-box {
  background-color: #2b4b6b;
  height: 100%;

  .form-box {
    width: 450px;
    height: 300px;
    // background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    align-items: flex-end;
    background-image: radial-gradient(#fff, #2b4b6b);
    .el-form {
      width: 100%;
      .btn {
        text-align: right;
      }
    }
  }
}
</style>
