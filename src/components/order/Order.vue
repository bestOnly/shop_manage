<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
    <el-table :data="orderlist" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="订单编号" prop="order_number"></el-table-column>
      <el-table-column label="订单价格" prop="order_price"></el-table-column>
      <el-table-column label="是否付款" prop="pay_status">
        <template v-slot="{ row }">
          <el-tag type="success" v-if="row.pay_status === '1'">已付款</el-tag>
          <el-tag type="danger" v-else>未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否发货" prop="is_send">
        <template v-slot="{ row }">
          {{row.is_send}}
        </template>
      </el-table-column>
      <el-table-column label="下单时间" prop="create_time">
        <template v-slot="{ row }">
          {{row.create_time | createTime}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
          <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
        </template>
      </el-table-column>
    </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
   </el-card>

    <!-- 修改地址的对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressClosed">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressList" :key="index" :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import createTime from '@/utils/validate.js'
import cityData from './citydata.js'

export default {
  filters: {
    createTime
  },
  data() {
    return {
      orderlist: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      addressVisible: false,
      progressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address2: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      cityData: cityData,
      progressList: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data } = await this.$http.get('orders', { params: this.queryInfo })
      this.orderlist = data.data.goods
      this.total = data.data.total
    },
    showBox() {
      this.addressVisible = true
    },
    async showProgressBox() {
      this.progressVisible = true
      const { data } = await this.$http.get(`/kuaidi/${1106975712662}`)
      this.progressList = data.data
    },
    addressClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getOrderList()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getOrderList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader{
  width: 100%;
}
</style>
