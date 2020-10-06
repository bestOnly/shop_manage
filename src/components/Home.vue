<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/img/25.jpg" alt="" />
        <h2>电商后台管理系统</h2>
      </div>
      <el-button @click="logout" size="small">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '60px' : '200px'">
        <div class="close" @click="turnOpen">|||</div>
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#2f4a69"
          text-color="#fff"
          :collapse-transition="false"
          :unique-opened="true"
          active-text-color="skyblue"
          :collapse="isCollapse"
          router
        >
          <el-submenu
            :index="'/' + item.path + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + child.path + ''"
              v-for="child in item.children"
              :key="child.id"
            >
              <template slot="title">
                <i class="el-icon-menu font"></i>
                <span>{{ child.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
          <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import session from '@/utils/session'
export default {
  created() {
    this.getMenuList()
  },
  data() {
    return {
      menuList: [],
      iconList: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false
    }
  },
  methods: {
    async getMenuList() {
      const { data } = await this.$http.get('menus')
      this.menuList = data.data
    },
    logout() {
      session.clear()
      this.$router.push('/login')
    },
    turnOpen() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #273e57;
  display: flex;
  justify-content: space-between;
  img {
    width: 45px;
    height: 45px;
    border-radius: 50%;
  }
  > div {
    display: flex;
    align-items: center;
    h2 {
      margin-left: 20px;
      font-size: 20px;
      color: #fff;
    }
  }
}
.close{
  background-color: rgb(37, 59, 78);
  height: 30px;
  text-align: center;
  letter-spacing: .5em;
  color: rgb(196, 196, 196);
  line-height: 30px;
  cursor: pointer;
  -webkit-user-select: none;
}
i.font{
  color: #fff;
}
.iconfont{
  color: #fff;
  margin-right: 15px;
}
.el-aside {
  background-color: #2f4a69;
  transition: all .5s;
}
.el-main {
  background-color: #e9eef3;
}
.el-container {
  height: 100%;
}
.el-menu {
  border: 0;
}
</style>
