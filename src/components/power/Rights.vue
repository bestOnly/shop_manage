<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-card>
      <el-table :data="rightList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="380">
        </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
            <template v-slot="{ row }">
              <el-tag v-if="row.level === '0'">一级</el-tag>
              <el-tag type="success" v-else-if="row.level === '1'">二级</el-tag>
              <el-tag type="warning" v-else>三级</el-tag>
            </template>
        </el-table-column>

      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRightsList()
  },
  data() {
    return {
      rightList: []
    }
  },
  methods: {
    async getRightsList() {
      const { data } = await this.$http.get('rights/list')
      this.rightList = data.data
    }
  }
}
</script>

<style lang="less" scoped>
</style>
