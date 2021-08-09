<template>
  <common class="login" style="height: 100%;overflow: hidden">
    <Row type="flex" justify="center" align="top">
      <Col span="8">
        <Card dis-hover>
          <div v-if="dingTalkResult" style="text-align: left">
            <CellGroup>
              <Cell v-for="(item,index) in dingTalkResult.userList" :key="index" :title="item.user.username+'('+item.user.name+')'" extra="点击登录此用户"
              @click.native="dingTalkLogin(dingTalkResult.dingTalkToken,item.user.username)"/>
            </CellGroup>
            <div style="margin-top: 10px;text-align: center;color: #ff9900">页面有效期剩余时间：{{remainingTime}}s</div>
          </div>
          <div v-else style="height: 100%;text-align: center">钉钉登录信息处理中....</div>
        </Card>
      </Col>
    </Row>
  </common>
</template>

<script>
import UserRedirect from '../mixins/userRedirect'
import Common from '../component/common'
import loginErrorHandlerDingDing from "@/error/auth/login-error-handler-ding-ding";
import selectUserListByDingTalkCodeErrorHandler from "@/error/auth/select-user-list-by-ding-talk-code-error-handler";
import commonData from "@/config/common-data";
import redirectToAuthWithLoginType from "@/error/common/redirect-to-auth-with-login-type";
let timeInstance1,timeInstance2;

export default {
  name: "dingTalkAuth",
  data() {
    return {
      dingTalkResult: null,
      remainingTime:60,
    }
  },
  methods: {
    dingTalkHandler() {
      let code = this.$route.query.code;
      this.$axios({
        url: this.$server_address + '/dingTalk/selectUserListByDingTalkCode/' + code,
        method: 'post'
      }).then((res) => {
        let r = res.data;
        if (r.userList.length === 1) {
          this.dingTalkLogin(r.dingTalkToken, r.userList[0].user.username)
        } else if(r.userList.length === 0){
          commonData.system_alert_modal.open({
            title: "钉钉鉴权失败",
            content: "系统找不到您在系统内的钉钉绑定记录",
            onOk: () => {
              redirectToAuthWithLoginType('dingTalk');
            }
          });
        } else {
          this.$data.dingTalkResult = res.data;
          timeInstance1 = setInterval(()=>{
            this.$data.remainingTime = this.$data.remainingTime-1;
          },1000)
          timeInstance2 = setTimeout(()=>{
            redirectToAuthWithLoginType('dingTalk');
          },60000);
        }
      }).catch(err => {
        selectUserListByDingTalkCodeErrorHandler(err);
      });
    },
    dingTalkLogin(code, username) {
      this.$axios({
        url: this.$server_address + '/auth/login',
        headers: {
          "SSO_LOGIN_TYPE": 'ding-talk',
          "ding-talk-code": code,
          "ding-talk-username": username,
        },
        method: 'post'
      }).then(() => {
        this.$Message.success('登录成功');
        this.user_redirect()
      }).catch(err => {
        loginErrorHandlerDingDing(err);
      });
    },
  },
  created() {
    this.dingTalkHandler()
  },
  beforeDestroy() {
    if(timeInstance1){
      clearInterval(timeInstance1);
    }
    if(timeInstance2){
      clearTimeout(timeInstance2);
    }
  },
  mixins: [UserRedirect],
  components: {Common}
}
</script>