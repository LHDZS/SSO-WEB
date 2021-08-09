<template>
  <div style="padding: 15px">
    <Card dis-hover title="创建用户">
      <div style="width: 330px">
        <Form ref="insertUserForm" :label-width="80" :model="insertUserForm" :rules="insertUserFormRules">
          <FormItem label="用户名" prop="username">
            <Input v-model="insertUserForm.username" placeholder="请输入用户名"></Input>
          </FormItem>
          <FormItem label="姓名" prop="name">
            <Input v-model="insertUserForm.name" placeholder="姓名"></Input>
          </FormItem>
          <FormItem label="邮箱地址" prop="email">
            <Input v-model="insertUserForm.email" placeholder="请输入邮箱地址" style="width: 250px"></Input>
          </FormItem>
          <Button class="user-form-button" type="primary" @click="insert">创建新用户</Button>
        </Form>
      </div>
    </Card>
    <Card dis-hover title="用户管理" style="margin-top: 15px">
      <Input placeholder="搜索用户" v-model="config.searchStr" @on-change="searchAuto">
        <Icon type="ios-search" slot="suffix" style="cursor: pointer" @click.native="search"/>
      </Input>
      <Table size="small" :data="search_list" :columns="columns" border style="margin-top: 15px">
        <template slot-scope="{ row, index }" slot="name">
          {{row.user.name}}
        </template>
        <template slot-scope="{ row, index }" slot="email">
          {{row.user.email}}
        </template>
        <template slot-scope="{ row, index }" slot="enable">
          <Tag color="success" v-if="row.user.enabled">正常</Tag>
          <Tag color="error" v-else>禁止登录</Tag>
        </template>
        <template slot-scope="{ row, index }" slot="handler">
          <Button type="error" ghost size="small" v-if="row.user.enabled" @click="disableUser(row.user.id)">禁止用户登录</Button>
          <Button type="success" ghost size="small" v-else @click="enableUser(row.user.id)">允许用户登录</Button>
        </template>
      </Table>
    </Card>
  </div>
</template>

<script>
import checkUsernameUniqueErrorHandler from "@/error/user/check-username-unique-error-handler";
import searchUserPageErrorHandler from "@/error/user/search-user-page-error-handler";
import insertUserErrorHandler from "@/error/user/insert-user-error-handler";
import enableUserErrorHandler from "@/error/user/enable-user-error-handler";
import disableUserErrorHandler from "@/error/user/disable-user-error-handler";
import commonData from "@/config/common-data";

let timeOutInstance = null;

export default {
  name: "adminUserManager",
  data() {
    let _this = this;
    return {
      columns:[
        {
          title: '用户名',
          key: 'username'
        },
        {
          title: '姓名',
          slot: 'name'
        },
        {
          title: '邮箱',
          slot: 'email'
        },
        {
          title: '账号状态',
          slot: 'enable'
        },
        {
          title: '操作',
          slot: 'handler'
        },
      ],
      config: {
        searchStr: "",
        page: 1,
        pageSize: 20
      },
      search_list: [],
      insertUserForm: {
        username: '',
        password: '',
        name: '',
        email: ''
      },
      insertUserFormRules: {
        username: [
          {required: true, message: '用户名不能为空', trigger: 'blur'},
          {min: 1, max: 20, message: '用户名不能超过20个字符', trigger: 'blur'},
          {
            trigger: 'blur', validator: (rule, value, callback) => {
              _this.$axios({
                url: _this.$server_address + '/user/checkUsernameUnique/' + value,
                method: 'post',
                'hide-spin': true
              }).then(() => {
                callback();
              }).catch(err => {
                checkUsernameUniqueErrorHandler(err,(error)=>{
                  callback(error);
                })
              })
            }
          },
        ],
        name: [
          {required: true, message: '姓名不能为空', trigger: 'blur'},
          {min: 1, max: 10, message: '姓名不能超过10个字符', trigger: 'blur'},
        ],
        email: [
          {required: true, message: '邮箱不能为空', trigger: 'blur'},
          {min: 1, max: 100, message: '邮箱不能超过100个字符', trigger: 'blur'},
          {pattern:/^[\w_\-.]+@game2sky.com$/, message: '邮箱必须满足XXX.@game2sky.com', trigger: 'blur'},
        ],
      }
    }
  },
  methods: {
    searchAuto(){
      if (timeOutInstance) {
        clearTimeout(timeOutInstance);
      }
      timeOutInstance = setTimeout(()=>{
        this.search();
      },500)
    },
    search() {
      this.$axios({
        url: this.$server_address + '/user/searchUserPage',
        method: 'post',
        data: this.$data.config,
        'hide-spin':true,
      }).then(res => {
        this.$data.search_list = res.data.content;
      }).catch(err => {
        searchUserPageErrorHandler(err);
      })
    },
    enableUser(userId){
      commonData.system_confirm_modal.open({
        title: '确定要允许用户登录吗',
        content: '用户将获得登录系统的能力',
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          this.$axios({
            url: this.$server_address + '/user/enableUser/'+userId,
            method: 'post',
          }).then(() => {
            this.search();
            this.$Message.success("允许用户登录成功")
          }).catch(err => {
            enableUserErrorHandler(err);
          })
        },
        onCancel: () => {

        }
      });
    },
    disableUser(userId){
      commonData.system_confirm_modal.open({
        title: '确定要禁止用户登录吗',
        content: '如果当前用户正在操作，用户登录状态会失效',
        onOk: () => {
          this.$axios({
            url: this.$server_address + '/user/disableUser/'+userId,
            method: 'post',
          }).then(() => {
            this.search();
            this.$Message.success("禁止用户登录成功")
          }).catch(err => {
            disableUserErrorHandler(err)
          })
        },
        onCancel: () => {

        }
      });
    },
    insert() {
      this.$refs.insertUserForm.validate(valid => {
        if (valid) {
          this.$axios({
            url: this.$server_address + '/user/insertUser',
            method: 'post',
            data: this.$data.insertUserForm
          }).then(() => {
            this.$Modal.success({
              title: '注册成功',
              content: '账号已创建，请前往登录页登录！'
            });
            this.$refs.insertUserForm.resetFields();
          }).catch(err => {
            insertUserErrorHandler(err);
          })
        }
      })
    }
  },
}
</script>

<style scoped>
.user-form-button {
  margin-left: 80px;
  width: 250px;
}
</style>