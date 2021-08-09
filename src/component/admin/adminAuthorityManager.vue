<template>
  <div style="padding: 15px;background-color: #fff;">
    <Tabs :animated="false" type="card" v-model="model">
      <TabPane v-for="(item,key) in authorityConfigList" :key="key" :label="item.label" :name="key"
               v-if="item.scope==='admin'&&admin||item.scope==='super-admin'&&superAdmin">
        <Input v-model="filter" placeholder="输入用户名或姓名查找用户"></Input>
        <div class="content">
          <Tag type="dot" class="authority-tag" closable :color="filtrate(item)?'error':'success'"
               v-for="(item,index) in item.data"
               @on-close="removeAuthority(item)" :key="index">
            {{ item.name }} ({{ item.username }})
          </Tag>
          <Button type="primary" class="authority-tag" ghost @click="modal=true" v-show="loaded">{{ item.insertLabel }}</Button>
        </div>
      </TabPane>
    </Tabs>
    <Modal v-model="modal" title="选择用户" @on-ok="insertAuthority">
      <Select
          v-model="userId"
          filterable
          :remote-method="searchAUser"
          :loading="user_loading">
        <Option v-for="(option, index) in user_list" :value="option.user.id" :key="index"
                :label="option.user.name+' ('+option.user.username+')'"/>
      </Select>
    </Modal>
  </div>
</template>

<script>
import insertAuthorityErrorHandler from "@/error/user/insert-authority-error-handler";
import searchUserPageErrorHandler from "@/error/user/search-user-page-error-handler";
import selectUserByAuthorityErrorHandler from "@/error/user/select-user-by-authority-error-handler";
import commonData from "@/config/common-data";

let timeOutInstance = null;
export default {
  name: "adminAuthorityManager",
  data() {
    return {
      filter: "",
      model: 'OKR-ADMIN',
      modal: false,
      loaded:true,
      searchUserConfig: {
        searchStr: "",
        page: 1,
        pageSize: 20
      },
      authorityConfigList: {
        'OKR-ADMIN': {
          data: [],
          label: 'OKR系统管理员',
          insertLabel: '新建OKR系统管理员',
          scope: 'admin'
        },
        'HOME-ADMIN': {
          data: [],
          label: '内部官网管理员',
          insertLabel: '新建内部官网管理员',
          scope: 'admin'
        },
        'EPC-ADMIN': {
          data: [],
          label: '文化系统管理员',
          insertLabel: '新建文化系统管理员',
          scope: 'admin'
        },
        'QUESTIONNAIRE-ADMIN':{
          data: [],
          label: '文化之星管理员',
          insertLabel: '新建文化之星管理员',
          scope: 'admin'
        },
        'PES-ADMIN': {
          data: [],
          label: '绩效系统管理员',
          insertLabel: '新建绩效系统管理员',
          scope: 'admin'
        },
        'TALK-ADMIN': {
          data: [],
          label: '面谈系统管理员',
          insertLabel: '新建面谈系统管理员',
          scope: 'admin'
        },
        'ASSETS-ADMIN': {
          data: [],
          label: '资产系统管理员',
          insertLabel: '新建资产系统管理员',
          scope: 'admin'
        },
        'SSO-ADMIN': {
          data: [],
          label: '系统管理员',
          insertLabel: '新建系统管理员',
          scope: 'super-admin'
        },
        'CEO': {
          data: [],
          label: '首席执行官',
          insertLabel: '新建首席执行官',
          scope: 'super-admin'
        },
        'HR_VP': {
          data: [],
          label: '人力资源副总裁',
          insertLabel: '新建人力资源副总裁',
          scope: 'super-admin'
        },
        'HR_BP_LEADER': {
          data: [],
          label: 'HRBP HEAD',
          insertLabel: '新建HRBP HEAD',
          scope: 'super-admin'
        },
      },
      userId: null,
      user_loading: false,
      user_list: [],
      commonData
    }
  },
  computed: {
    filtrate() {
      return (item) => {
        return this.$data.filter.length > 0 && (item.username.indexOf(this.$data.filter) !== -1 || item.name.indexOf(this.$data.filter) !== -1);
      }
    },
    admin() {
      if (commonData.sso_user) {
        for (let i = 0; i < commonData.sso_user.authorities.length; i++) {
          let item = commonData.sso_user.authorities[i];
          if (item.authority === 'SSO-SUPER-ADMIN' || item.authority === 'SSO-ADMIN') {
            return true;
          }
        }
      }
      return false;
    },
    superAdmin() {
      if (commonData.sso_user) {
        for (let i = 0; i < commonData.sso_user.authorities.length; i++) {
          let item = commonData.sso_user.authorities[i];
          if (item.authority === 'SSO-SUPER-ADMIN') {
            return true;
          }
        }
      }
      return false;
    }
  },
  methods: {
    removeAuthority(user) {
      commonData.system_confirm_modal.open({
        title: '确认取消用户权限',
        content: '您确认要取消' + user.name + '的权限吗',
        onOk: () => {
          this.$axios({
            url: this.$server_address + '/user/insertAuthority',
            method: 'post',
            data: {
              userId: user.id,
              authority: this.$data.model,
              enable: false,
            }
          }).then(() => {
            this.$Message.success("操作成功")
            this.select();
          }).catch(err => {
            insertAuthorityErrorHandler(err);
          })
        },
      });
    },
    insertAuthority() {
      if (this.$data.userId) {
        this.$axios({
          url: this.$server_address + '/user/insertAuthority',
          method: 'post',
          data: {
            userId: this.$data.userId,
            authority: this.$data.model,
            enable: true,
          }
        }).then(() => {
          this.$Message.success("操作成功")
          this.select();
          this.$data.userId = null;
        }).catch(err => {
          insertAuthorityErrorHandler(err);
        })
      } else {
        this.$Message.error("操作失败！请选择用户")
      }
    },
    searchAUser(query) {
      if (query) {
        this.$data.user_loading = true;
        this.$data.searchUserConfig.searchStr = query;
        if (timeOutInstance) {
          clearTimeout(timeOutInstance);
        }
        timeOutInstance = setTimeout(() => {
          this.$axios({
            url: this.$server_address + '/user/searchUserPage',
            method: 'post',
            data: this.$data.searchUserConfig,
            'hide-spin': true
          }).then(res => {
            this.$data.user_loading = false;
            this.$data.user_list = res.data.content
          }).catch(err => {
            this.$data.user_loading = false;
            searchUserPageErrorHandler(err)
          })
        }, 500)
      } else {
        this.$data.userList = [];
      }
    },
    select() {
      for (const configKey in this.$data.authorityConfigList) {
        this.$set(this.$data.authorityConfigList[configKey], 'data', []);
      }
      this.$data.loaded = false;
      this.$axios({
        url: this.$server_address + '/user/selectUserByAuthority/' + this.$data.model,
        method: 'post',
        'hide-spin': true
      }).then(res => {
        this.$nextTick(()=>{
          this.$set(this.$data.authorityConfigList[this.$data.model], 'data', res.data);
          this.$data.loaded = true;
        })
      }).catch(err => {
        selectUserByAuthorityErrorHandler(err)
      })
    },
  },
  watch: {
    model() {
      this.select();
    }
  },
  created() {
    this.select()
  }
}
</script>

<style scoped>
.authority-tag {
  margin: 8px;
}

.content {
  margin-top: 15px;
  border-radius: 5px;
  border: 1px solid #DDD;
}
</style>