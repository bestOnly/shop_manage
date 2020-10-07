<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row class="cat_opt">
        <el-col>
          <el-alert
            show-icon
            title="注意：只允许第三级分类设置相关参数"
            type="warning"
          ></el-alert>
        </el-col>
      </el-row>
      <span class="title">请选取商品分类 :</span>
      <!-- 下拉选 -->
      <el-cascader
        expand-trigger="hover"
        v-model="selectKeys"
        :options="cateList"
        :props="cateProp"
        @change="cateChange"
        clearable
      >
      </el-cascader>
      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isDisabled" @click="openAddBox"
            >添加参数</el-button
          >
          <el-table :data="manyParamData" border stripe>
            <el-table-column type="expand">
              <template v-slot="{ row }">
                <el-tag v-for="(item,i) in row.attr_vals" :key="i" closable @close="delTags(i,row)">{{ item }}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ New Tag</el-button>

              </template>
            </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="{ row }">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="updateParam(row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="delParam(row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isDisabled" @click="openAddBox"
            >添加属性</el-button
          >
          <el-table :data="onlyParamData" border stripe>
            <el-table-column type="expand">
              <template v-slot="{ row }">
                <el-tag v-for="(item,i) in row.attr_vals" :key="i" closable @close="delTags(i,row)">{{ item }}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ New Tag</el-button>

              </template>
            </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="{ row }">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="updateParam(row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="delParam(row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 增加的模态框 -->
    <el-dialog
      :title="'添加' + paramText"
      :visible.sync="ParamVisible"
      width="50%"
    >
      <!-- 添加参数的对话框 -->
      <el-form
        :model="addParam"
        :rules="addFormRules"
        ref="paramForm"
        label-width="100px"
      >
        <el-form-item :label="paramText" prop="attr_name">
          <el-input v-model="addParam.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改的模态框 -->
    <el-dialog
      :title="'修改' + paramText"
      :visible.sync="updateParamVisible"
      width="50%"
    >
      <!-- 添加参数的对话框 -->
      <el-form
        :model="editParam"
        :rules="addFormRules"
        ref="paramForm"
        label-width="100px"
      >
        <el-form-item :label="paramText" prop="attr_name">
          <el-input v-model="editParam.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateParamVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUpdateParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getCateList()
  },
  data() {
    return {
      cateList: [],
      selectKeys: [],
      cateProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 标签页
      activeName: 'many',
      // 标签页选择
      manyParamData: [],
      onlyParamData: [],
      ParamVisible: false,
      updateParamVisible: false,
      addParam: {
        attr_name: ''
      },
      editParam: {
        attr_id: '',
        attr_name: ''
      },
      addFormRules: {
        attr_name: [{ required: true, message: '请输入参数', trigger: 'blur' }]
      }
    }
  },
  methods: {
    async getCateList() {
      const { data } = await this.$http.get('categories')
      this.cateList = data.data
    },
    // 下拉选触发
    async cateChange() {
      // console.log(this.selectKeys)
      this.getParamsData()
    },
    // 标签页触发
    handleClick() {
      this.getParamsData()
      // console.log(this.activeName)
    },
    // 获取参数
    async getParamsData() {
      if (this.selectKeys.length !== 3) {
        this.selectKeys = []
        this.manyParamData = []
        this.onlyParamData = []
        return
      }
      const { data } = await this.$http.get(`categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      data.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 单独给元素添加属性（加标签）
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框输入的值
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyParamData = data.data
      } else {
        this.onlyParamData = data.data
      }
      console.log(data)
    },
    // 添加属性/参数
    openAddBox() {
      this.ParamVisible = true
    },
    async addParams() {
      // this.$refs.paramForm.validate(async valid => {
      const { data } = await this.$http.post(
        `categories/${this.cateId}/attributes`,
        {
          attr_name: this.addParam.attr_name,
          attr_sel: this.activeName
        }
      )
      console.log(data)
      this.getParamsData()
      this.ParamVisible = false
      // })
    },
    // 打开修改框
    async updateParam(attrId) {
      const { data } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attrId}`,
        {
          params: {
            attr_sel: this.activeName
          }
        }
      )
      this.editParam.attr_id = attrId
      this.editParam.attr_name = data.data.attr_name
      this.updateParamVisible = true
    },
    // 编辑参数
    async saveUpdateParams() {
      const { data } = await this.$http.put(
        `categories/${this.cateId}/attributes/${this.editParam.attr_id}`,
        {
          attr_name: this.editParam.attr_name,
          attr_sel: this.activeName
        }
      )
      console.log(data)
      this.getParamsData()
      this.updateParamVisible = false
    },
    // 删除
    async delParam(attrId) {
      if (confirm('真要删除吗？')) {
        const { data } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)
        console.log(data)
        this.getParamsData()
      }
    },
    // 添加新的标签
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false

      this.saveUpdateTags(row)
    },
    // 封装统一修改标签的函数
    async saveUpdateTags(row) {
      const { data } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      console.log(data)
    },
    // 显示输入框 （直接获取焦点）
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除标签
    delTags(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveUpdateTags(row)
    },
    addDialogClosed() {
      this.refs.paramForm.resetFields()
    }
  },
  computed: {
    // 如果没有选中三级分类则禁用
    isDisabled() {
      if (this.selectKeys.length !== 3) {
        return true
      }
      return false
    },
    // 三级分类的ID
    cateId() {
      if (this.selectKeys.length === 3) {
        return this.selectKeys[2]
      }
      return null
    },
    paramText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 20px 0;
}
.title {
  margin-right: 10px;
}
.el-tag{
  margin-right: 10px;
}
.el-input{
  width: 120px;
}
</style>
