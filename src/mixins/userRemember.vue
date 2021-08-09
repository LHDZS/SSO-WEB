<template>

</template>

<script>

import loginStatusErrorHandlerIndex from "@/error/auth/login-status-error-handler-index";

export default {
  name: "userRemember",
  methods: {
    remember_select_cookie() {
      let cookie = document.cookie;
      let name, code;
      if (cookie && cookie.length > 0) {
        let sss = cookie.split(';');
        for (let i = 0; i < sss.length; i++) {
          let ss = sss[i].split('=');
          if (ss.length === 2) {
            if (ss[0].trim() === 'yc-name') {
              name = ss[1].trim();
            } else if (ss[0].trim() === 'yc-code') {
              code = ss[1].trim();
            }
          }
        }
      }
      if (name && code) {
        return {name, code}
      }
    },
    try_remember_login(callback = () => {
    }) {
      this.$axios({
        url: this.$server_address + '/user/loginStatus',
        method: 'post'
      }).then(() => {
        callback();
      }).catch(err => {
        if (err && err.response && err.response.status === 401) {
          let cookie = this.remember_select_cookie();
          if (cookie) {
            this.$axios({
              url: this.$server_address + '/auth/login',
              data: {
                username: cookie.name,
                password: cookie.code,
              },
              headers: {
                "SSO_LOGIN_TYPE": 'remember',
              },
              method: 'post'
            }).then(() => {
              callback();
            }).catch(() => {
              document.cookie = '';
              callback();
            });
          } else {
            callback()
          }
        }
      })
    },
  }
}
</script>

<style scoped>

</style>