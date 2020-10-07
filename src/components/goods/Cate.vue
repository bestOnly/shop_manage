<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCate">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text
        border
        show-row-hover
      >
        <!-- 分类是否有效 -->
        <template slot="isOK" slot-scope="scope">
          <i
            style="color:lightgreen"
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i style="color:red" class="el-icon-error" v-else></i>
        </template>
        <!-- 分类等级 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template slot="manage">
          <el-button type="primary" size="small">编辑</el-button>
          <el-button type="danger" size="small">删除</el-button>
        </template>
      </tree-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
    </el-card>

        <el-dialog
          title="添加分类"
          :visible.sync="cateVisible"
          width="50%"
          @close="closeCate"
          >
          <el-form :model="addCateForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级名称">
            <el-cascader
              expand-trigger="hover"
              v-model="pointCate"
              :options="parentCateList"
              :props="cascaderProps"
              @change="cateChange"
              clearable
              change-on-select
              >
            </el-cascader>
          </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cateVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveCate">确 定</el-button>
          </span>
        </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getGoodsCate()
  },
  data() {
    return {
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOK'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'manage'
        }
      ],
      cateVisible: false,
      ruleForm: {
        cat_name: ''
      },
      rules: {
        cat_name: [
          { required: true, message: '分类名不能为空', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      pointCate: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      }
    }
  },
  methods: {
    // 获取分类
    async getGoodsCate() {
      const { data } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      console.log(data.data.result)
      this.total = data.data.total
      this.cateList = data.data.result
    },
    // 获取父类的分类
    async getParentCateList() {
      const { data } = await this.$http.get('categories', { params: { type: 2 } })
      this.parentCateList = data.data
    },
    showAddCate() {
      this.cateVisible = true
      this.getParentCateList()
    },
    // 处理分类的添加
    cateChange() {
      console.log(this.pointCate)
      if (this.pointCate.length > 0) {
        this.addCateForm.cat_pid = this.pointCate[this.pointCate.length - 1]
        this.addCateForm.cat_level = this.pointCate.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    /* 保存分类 */
    saveCate() {
      console.log(this.addCateForm)
      this.$refs.ruleForm.validate(async valid => {
        const { data } = await this.$http.post('categories', this.addCateForm)
        console.log(data)
        this.getGoodsCate()
        this.cateVisible = false
      })
    },
    // 清空对话框
    closeCate() {
      this.$refs.ruleForm.resetFields()
      this.pointCate = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getGoodsCate()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getGoodsCate()
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.zk-table--level-1-cell {
  font-size: 16px;
}
/deep/.zk-table--level-2-cell {
  font-size: 14px;
}
.zk-table {
  margin-top: 20px;
}
.el-cascader{
  width: 100%;
}
</style>
