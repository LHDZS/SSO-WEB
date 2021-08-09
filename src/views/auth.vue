<template>
  <div class="login" style="height: 100%;overflow: hidden">
    <Row type="flex" justify="center" align="middle" style="height:100%;text-align: center">
      <Col span="8">
        <Row>
          <Col span="16" offset="4">
            <img src="../img/logo.png" width="100%" style="margin-bottom: 30px">
          </Col>
        </Row>
        <username-password-login-card v-if="loginType==='usernamePassword'">
          <div class="yc-auth-footer">
            <a v-show="loginType==='usernamePassword'" @click="loginType='dingTalk'">切换为钉钉账号登录</a>
          </div>
        </username-password-login-card>
        <ding-talk-login-card v-if="loginType==='dingTalk'">
          <div class="yc-auth-footer">
            <a v-show="loginType==='dingTalk'" @click="loginType='usernamePassword'">切换为账号密码登录</a>
          </div>
        </ding-talk-login-card>
      </Col>
    </Row>
  </div>

</template>
<script>
import UsernamePasswordLoginCard from '../component/usernamePasswordLoginCard'
import DingTalkLoginCard from '../component/dingTalkLoginCard'
import GuestPageStatusCheck from '../mixins/guestPageStatusCheck'

export default {
  data() {
    return {
      loginType: 'usernamePassword'
    }
  },
  components: {
    UsernamePasswordLoginCard, DingTalkLoginCard
  },
  mixins: [GuestPageStatusCheck],
  created() {
    let loginTypeQuery = this.$route.query.loginType;
    if (loginTypeQuery === 'usernamePassword' || loginTypeQuery === 'dingTalk') {
      this.$data.loginType = loginTypeQuery;
    }
  }
}
</script>
<style scoped>
.yc-auth-footer {
  margin-top: 8px;
  text-align: center;
}
</style>