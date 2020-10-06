<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" style="width: 100%" stripe border>
        <el-table-column type="expand">
          <template v-slot="{ row }">
            <!-- 渲染一级权限 -->
            <el-row
              v-for="(item1, i1) in row.children"
              :key="item1.id"
              :class="[i1 === 0 ? 'bdt' : '', 'bdb', 'vcenter']"
            >
              <el-col :span="5">
                <el-tag closable @close="delRightById(row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 渲染二级权限 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdt', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="delRightById(row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 渲染三级权限 -->
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="delRightById(row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="{ row }">
            <el-button type="primary" icon="el-icon-edit" size="small"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="small"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="small"
              @click="openRightBox(row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配权限模态框 -->
      <el-dialog title="分配权限" :visible.sync="rightVisible" width="50%"
          @close="blankArr">
        <el-tree
          :data="rightList"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-expanded-keys="rightsArr"
          :default-checked-keys="rightsArr"
          :props="treeProps"
          ref="treeRight"
        >
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rightVisible = false">取 消</el-button>
          <el-button type="primary" @click="giveRights"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRolesList()
  },
  data() {
    return {
      roleList: [],
      rightVisible: false,
      rightList: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      rightsArr: [],
      roleId: ''
    }
  },
  methods: {
    async getRolesList() {
      const { data } = await this.$http.get('roles')
      this.roleList = data.data
    },
    // 根据ID删除权限
    async delRightById(role, right) {
      const result = await this.$confirm(
        '此操作将删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (result !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const { data } = await this.$http.delete(
        `roles/${role.id}/rights/${right}`
      )
      console.log(data.data)
      // 为了不让页面刷新，这里重新赋值
      role.children = data.data
    },
    async openRightBox(role) {
      const { data } = await this.$http.get('rights/tree')
      this.rightList = data.data

      this.getThirdKeys(role, this.rightsArr)
      this.rightVisible = true
      this.roleId = role.id
    },
    // 通过递归的方式获取所有的三级权限
    getThirdKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getThirdKeys(item, arr)
      })
    },
    // 每次分配权限前 先清空
    blankArr() {
      this.rightsArr = []
    },
    // 给角色分配权限
    async giveRights() {
      // 获取所有选中的和半选中的集合
      const keys = [
        ...this.$refs.treeRight.getCheckedKeys(),
        ...this.$refs.treeRight.getHalfCheckedKeys()
      ]
      const rightIds = keys.join(',')
      const { data } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: rightIds })
      console.log(data)
      this.getRolesList()
      this.rightVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 8px;
}
.bdt {
  border-top: 1px solid #eee;
}
.bdb {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
