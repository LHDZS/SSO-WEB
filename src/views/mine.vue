<style lang="less" scoped>
.mine {
  width: 100%;
  height: 100%;
  .main {
    float: left;
    width: calc(100% - 192px);
    height: calc(100% - 63px);
    background-color: #f2f2f2;
    padding: 10px;
    box-sizing: border-box;
    overflow-y: auto;
  }
}
</style>

<template>
  <div class="mine">
    <navigationBar></navigationBar>
    <navigationBarLeft></navigationBarLeft>
    <div class="main">
      <router-view />
    </div>
  </div>
</template>

<script>
// 新
import navigationBar from "@/component/navigationBar";
import navigationBarLeft from "@/component/navigationBarLeft";
// 旧
import UserPageStatusCheck from "@/mixins/userPageStatusCheck";
import AdminUserManager from "@/component/admin/adminUserManager";
import AdminAuthorityManager from "@/component/admin/adminAuthorityManager";
import AdminDepartmentManager from "@/component/admin/adminDepartmentManager";
import Common from "@/component/common";
import redirectToUser from "@/error/common/redirect-to-user";

export default {
  name: "mine",
  data() {
    return {
      handler: "user",
    };
  },
  computed: {
    adminAuthority() {
      if (this.$data.user_info.authorities.length > 0) {
        for (let i = 0; i < this.$data.user_info.authorities.length; i++) {
          if (this.$data.user_info.authorities[i].authority === "SSO-ADMIN") {
            return true;
          }
        }
      }
      return false;
    },
    superAdminAuthority() {
      if (this.$data.user_info.authorities.length > 0) {
        for (let i = 0; i < this.$data.user_info.authorities.length; i++) {
          if (
            this.$data.user_info.authorities[i].authority === "SSO-SUPER-ADMIN"
          ) {
            return true;
          }
        }
      }
      return false;
    },
  },
  methods: {
    // backToUser() {
    // 	redirectToUser(this);
    // }
  },
  mixins: [UserPageStatusCheck],
  components: {
    navigationBar: navigationBar,
    navigationBarLeft: navigationBarLeft,
  },
};
</script>