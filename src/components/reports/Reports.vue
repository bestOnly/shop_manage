<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div ref="main" style="width:1300px;height:500px"></div>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      option: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: []
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [],
        yAxis: [],
        series: []
      }
    }
  },
  async mounted() {
    const myChart = this.$echarts.init(this.$refs.main)
    const { data } = await this.$http.get('reports/type/1')
    // 对象的合并 merge()
    const result = _.merge(data.data, this.option)
    myChart.setOption(result)
  }
}
</script>

<style lang="less" scoped></style>
