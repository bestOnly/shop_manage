<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏区域 -->

      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expand-trigger="hover"
                :options="cateList"
                :props="cateProps"
                v-model="addForm.goods_cat"
                @change="handleChange"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的Item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :headers="headerToken"
              :on-success="handleSuccess"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
             <quill-editor ref="myQuillEditor"
              v-model="addForm.goods_introduce"
             >
             </quill-editor>
             <el-button type="primary" @click="addGood">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
      title="预览图片"
      :visible.sync="picVisible"
      width="50%">
      <img :src="previewPic" alt="" class="pics">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import session from '@/utils/session.js'
export default {
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: '',
        pic: [],
        goods_introduce: '',
        attr: []
      },
      addFormRules: {
        goods_name: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择分类', trigger: 'blur' }]
      },
      cateList: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      manyTableData: [],
      onlyTableData: [],
      // 图片上传路径
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      fileList: [],
      headerToken: {
        authorization: session.get('token')
      },
      previewPic: '',
      picVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data } = await this.$http.get('categories')
      this.cateList = data.data
    },
    // 级联选择器变化触发
    handleChange() {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 在页面切换前触发
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    async tabClicked() {
      if (this.activeIndex === '1') {
        const { data } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        data.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.manyTableData = data.data
      } else if (this.activeIndex === '2') {
        const { data } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        this.onlyTableData = data.data
      }
    },
    // 预览图片
    handlePreview(file) {
      this.picVisible = true
      this.previewPic = file.response.data.url
    },
    // 删除图片
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pic.findIndex(x =>
        x.pic === filePath
      )
      this.addForm.pic.splice(i, 1)
      console.log(this.addForm)
    },
    // 上传成功后
    handleSuccess(res) {
      const picInfo = {
        pic: res.data.tmp_path
      }
      this.addForm.pic.push(picInfo)
    },
    // 添加商品
    async addGood() {
      // console.log(this.addForm)
      const form = _.cloneDeep(this.addForm)
      form.goods_cat = form.goods_cat.join(',')
      // 处理动态参数
      this.manyTableData.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_vals: item.attr_vals.join(' ')
        }
        this.addForm.attr.push(newInfo)
      })
      // 处理静态参数
      this.onlyTableData.forEach(item => {
        console.log(item)
        const newInfo = {
          attr_id: item.attr_id,
          attr_vals: item.attr_vals
        }
        this.addForm.attr.push(newInfo)
      })
      form.attr = this.addForm.attr

      const { data } = await this.$http.post('goods', form)
      this.$router.push('/goods')
      console.log(data)
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.pics{
  width: 100%;
}
.el-button{
  margin-top: 20px;
}
</style>
