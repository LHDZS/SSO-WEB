<template>

</template>

<script>

import loginStatusErrorHandlerUserPage from "@/error/auth/login-status-error-handler-user-page";
import commonData from "@/config/common-data";
import UserRemember from "@/mixins/userRemember";

export default {
  name: "userPageStatusCheck",
  data() {
    return {
      user_info: {
        user: {
          name: '正在加载'
        },
        authorities:[]
      }
    }
  },
  methods: {
    user_status_check() {
      let _this = this;
      _this.$axios({
        url: _this.$server_address + '/user/loginStatus',
        method: 'post'
      }).then(res => {
        this.$data.user_info.authorities = res.data.authorities;
        this.$data.user_info.user = res.data.user;
        this.$data.user_info.departments = [];
        for (let j = 0; j < res.data.departments.length; j++) {
          let key = res.data.departments[j].length - 1;
          if (key >= 0) {
            let name = res.data.departments[j][key].fullName
            // if (key == 0) {
            //   return this.$data.user_info.departments = this.$data.user_info.departments
            // }
            // let name = res.data.departments[j][key].fullName.replace(/云畅游戏-/g, "");
            this.$data.user_info.departments.push(name)
          }
        }
        if (this.$data.user_info.departments.length == 0) {
          this.$data.user_info.departments = ['暂无']
        }
        commonData.sso_user = res.data;
      }).catch(err => {
        loginStatusErrorHandlerUserPage(err);
      })
    }
  },
  mixins:[UserRemember],
  created() {
    this.try_remember_login(()=>{
      this.user_status_check();
    });
  }
}
</script>

<style scoped>

</style>