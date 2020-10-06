<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="userInfo.query"
            placeholder="请输入用户名关键字"
            class="input-with-select"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="openBox">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 列表 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="username" label="用户名" width="130">
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" width="150">
        </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="create_time" label="创建时间"> </el-table-column>
        <el-table-column label="用户状态" width="100">
          <template v-slot="{ row }">
            <el-switch
              v-model="row.mg_state"
              @change="changStatus(row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="role_name" label="用户类型" width="150">
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="openUpdate(row)"
            ></el-button>
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="delUser(row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                @click="openRoleBox(row)"
                type="warning"
                size="small"
                icon="el-icon-star-off"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userInfo.pagenum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="userInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 增加用户模态框 -->
    <el-dialog
      title="增加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="close"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="userForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户模态框 -->
    <el-dialog title="修改用户" :visible.sync="updateVisible" width="50%">
      <el-form
        :model="updateForm"
        ref="updateForm"
        :rules="updateRules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input disabled v-model="updateForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updateForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="updateForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限模态框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="giveRightVisible"
      width="50%">
      <span>当前的用户： {{ userDate.username }}</span>
       <el-divider></el-divider>
      <span>当前的角色： {{ userDate.role_name }}</span>
       <el-divider></el-divider>
       <p>分配新角色：
      <el-select v-model="selectRole" placeholder="请选择" @clear="blankRole">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
       </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="giveRightVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveGiveRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList()
  },
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      userInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      giveRightVisible: false,
      userList: [],
      userDate: {
        username: '',
        role_name: ''
      },
      roleList: {},
      selectRole: '',
      total: 0,
      dialogVisible: false,
      updateVisible: false,
      ruleForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 12, message: '用户名长度在5-12位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在6-15位', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      updateRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      updateForm: {
        id: '',
        email: '',
        mobile: ''
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    async getUserList() {
      const { data } = await this.$http.get('users', { params: this.userInfo })
      this.userList = data.data.users
      this.total = data.data.total
    },
    /* 监听状态的改变 */
    async changStatus(row) {
      await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
    },
    close() {
      this.$refs.userForm.resetFields()
    },
    openBox() {
      this.dialogVisible = true
    },
    /* 添加用户 */
    async addUser() {
      // this.$refs.userForm.validate(async (valid) => {
      // if (!valid) return
      const { data } = await this.$http.post('users', this.ruleForm)
      console.log(data)
      this.dialogVisible = false
      this.getUserList()
      // })
    },
    openUpdate(row) {
      console.log(typeof row.id)
      this.updateVisible = true
      this.updateForm = row
    },
    /* 修改用户 */
    updateUser() {
      this.$refs.updateForm.validate((valid) => {
        if (!valid) return
        this.$http.put(`users/${this.updateForm.id}`, this.updateForm)
        this.updateVisible = false
        this.getUserList()
      })
    },
    cancel() {
      this.updateVisible = false
      this.$refs.updateForm.resetFields()
    },
    /* 删除用户 */
    delUser(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$http.delete('users/' + id)
        this.getUserList()
      }).catch(err => {
        this.$message.info('已取消删除' + err)
      })
    },
    async openRoleBox(row) {
      this.userDate = row
      this.giveRightVisible = true
      const { data } = await this.$http.get('roles')
      this.roleList = data.data
    },
    async saveGiveRight() {
      if (!this.selectRole) {
        return this.$message.error('请选择新角色')
      }
      const { data } = await this.$http.put(`users/${this.userDate.id}/role`, { rid: this.selectRole })
      console.log(data)
      this.getUserList()
      this.giveRightVisible = false
    },
    blankRole() {
      this.selectRole = ''
      this.userDate = ''
    },
    handleSizeChange(val) {
      this.userInfo.pagesize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.userInfo.pagenum = val
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
// .el-card {
//   margin-top: 20px;
// }
// .el-table {
//   margin-top: 20px;
// }
// /deep/ .cell {
//   text-align: center;
// }
</style>
