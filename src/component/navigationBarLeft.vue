<template>
  <div class="navigationBarLeft">
    <Menu :theme="theme2" width="256" :active-name="$route.path">
        <MenuItem v-for="(item,key) in menuLeftArr" :key="key" :name="item.path" :to="item.path">
            <Icon :type="item.icon" style="margin-right: 30px;margin-left: 10px"/>
            <span v-text="item.name"/>
        </MenuItem>
    </Menu>
  </div>
</template>

<script>
export default {
  name: 'navigationBarLeft',
  data () {
    return {
      theme2: 'light',
      menuLeftArr: [
        {name: '账号管理', icon: 'ios-paper', path: '/mine/adminUserManager'},
        {name: '权限管理', icon: 'ios-man', path: '/mine/adminJurisdictionManager'},
        {name: '角色管理', icon: 'ios-people', path: '/mine/adminAuthorityManager'},
        {name: '部门管理', icon: 'ios-color-filter', path: '/mine/adminDepartmentManager'},
      ],
    }
  },
  props:{
    activeIndex: String
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.navigationBarLeft {
  float: left;
  width: 192px;
  height: calc(100% - 63px);
  overflow-y: scroll; 
  white-space: nowrap;
  border-top: 1px solid #dcdee2;
  // border-right: 1px solid #eee;
  a{text-decoration:none; out-line: none; color: #333333}
  .logo {
    width: 100%;
    height: 153px;
    background-color: #D8D8D8;
  }
  
}
.navigationBarLeft::-webkit-scrollbar {
    width: 0 !important;
}
</style>

<style>
.navigationBarLeft .el-submenu .el-menu-item {
    box-sizing: border-box;
    min-width: 100%;
    font-size: 12px;
}
.navigationBarLeft .el-menu {
    border-right: none;
}
.navigationBarLeft .el-menu-item.is-active a {
  color: #409EFF;
}
.navigationBarLeft .el-submenu__title {
  text-align: left;
}
</style>

<style>
.navigationBarLeft .ivu-menu {
  height: 100% !important;
}
</style>