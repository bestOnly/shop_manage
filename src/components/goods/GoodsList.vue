<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="goodSearch.query"
            class="input-with-select"
            clearable @clear="getGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="70px"
        ></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template v-slot="{ row }">
            {{ row.add_time | createTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodSearch.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="goodSearch.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import createTime from '@/utils/validate.js'
export default {
  filters: {
    createTime
  },
  data() {
    return {
      goodSearch: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      goodsList: [],
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品
    async getGoodsList() {
      const { data } = await this.$http.get('goods', {
        params: this.goodSearch
      })
      this.goodsList = data.data.goods
      this.total = data.data.total
      console.log(this.goodsList)
    },
    async removeById(id) {
      if (confirm('确定要删除吗？')) {
        const { data } = await this.$http.delete(`goods/${id}`)
        this.getGoodsList()
        console.log(data)
      }
    },
    goAddGoods() {
      this.$router.push('/goods/add')
    },
    handleSizeChange(val) {
      this.goodSearch.pagesize = val
      this.getGoodsList()
    },
    handleCurrentChange(val) {
      this.goodSearch.pagenum = val
      this.getGoodsList()
    }
  }
}
</script>

<style lang="less" scoped></style>
