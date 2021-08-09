<template>
  <div style="height: 100%;background-color: #FFFFFF">
		
  </div>
</template>
<script>
import UserRedirect from '../mixins/userRedirect'
import UserRemember from '../mixins/userRemember'
import loginStatusErrorHandlerIndex from "@/error/auth/login-status-error-handler-index";

export default {
  methods: {
    index_status_check() {
      let _this = this;
      _this.$axios({
        url: _this.$server_address + '/user/loginStatus',
        method: 'post'
      }).then(() => {
        _this.user_redirect();
      }).catch(err => {
        loginStatusErrorHandlerIndex(err);
      })
    },
  },
  mixins: [UserRedirect,UserRemember],
  created() {
    this.try_remember_login(()=>{
      this.index_status_check();
    })
  }
}
</script>
