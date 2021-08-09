<template>
  <div class="navigationBar">
    <div class="title"><img src="/icon/logo-black.png" alt=""></div>
    <div class="menu">
      <!-- <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item v-for="(item,key) in menuArr" :key="key" :index="item.path">{{item.name}}</el-menu-item>
      </el-menu> -->
    </div>
    <div class="my">
      <div class="img" @click="backToUser"></div>
      亲爱的 <span>{{user_info.user.name}}，</span>您好
      <Button type="primary" @click="exit()" size="default">退出</Button>
    </div>
  </div>
</template>

<script>
import UserPageStatusCheck from '../mixins/userPageStatusCheck';
import redirectToUser from "@/error/common/redirect-to-user";
import redirectToExit from "@/error/common/redirect-to-exit";

export default {
  name: 'navigationBar',
  data () {
    return {
      loginPhone: ''
    }
  },
   computed: {
  
  },
  props:{
    // menuArr:Array
  },
  methods: {
    exit() {
			redirectToExit(this);
		},
    backToUser() {
			redirectToUser(this);
		}
  },
  mounted() {

  },
  created() {

  },
  mixins: [UserPageStatusCheck]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.navigationBar {
  width: 100%;
  height:60px;
  background-color: #fff;
  border-bottom: 1px solid #dcdee2;
  margin-bottom: 3px;
  .title {
    float: left;
    width:148px;
    margin-left: 30px;
    margin-top: 10px;
    img {
      width: 100%;
    }
  }
  .menu {
    float: left;
    height: 100%;
    padding-left: 50px;
  }
  .my {
    float: right;
    height: 100%;
    line-height: 60px;
    margin-right: 30px;
    font-size:14px;
    font-family:PingFangSC;
    font-weight:400;
    color:rgba(51,51,51,1);
    display: flex;
    align-items: center;
    justify-content: center;
    // font-size: 16px;
    span {
      font-weight: 600;
      margin: 0 8px;
    }
    .img {
      width: 24px;
      height: 24px;
      background: url('../img/person.png') no-repeat;
      background-size: 100% 100%;
      margin-right: 15px;
      cursor: pointer;
    }
    .img:hover {
      background: url('../img/person-hover.jpg') no-repeat;
      background-size: 100% 100%;
    }
    button {
      margin-left: 20px;
    }
  }
}
</style>

<style>
.navigationBar .el-menu--horizontal>.el-menu-item {
  width: 130px;
  height: 60px;
  line-height: 60px;
}
.navigationBar .el-menu.el-menu--horizontal {
  border-bottom: none;
}
</style>
