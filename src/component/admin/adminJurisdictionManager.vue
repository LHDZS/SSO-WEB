<!--  -->
<style lang='less' scoped>
.adminJurisdictionManager {
    width: 100%;
    // height: 100%;
    background-color: #fff;
    .header {
        width: 100%;
        margin-bottom: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
</style>

<style>
.AJM_modal {
    text-align: left;
    width: 140px;
    margin: 0 auto;
}
.ivu-checkbox-group-item {
    margin: 10px 0px;
}
</style>

<template>
    <div class='adminJurisdictionManager'>
        <Card dis-hover title="权限管理">
            <div class="header">
                <div>
                    <!-- <Input icon="ios-search" v-model="config.searchStr" placeholder="请输入用户名搜索" style="width: auto" @on-click="search"/> -->
                    <Input placeholder="搜索用户" v-model="config.searchStr" style="width: 200px" @on-change="searchAuto">
						<Icon type="ios-search" slot="suffix" style="cursor: pointer" @click.native="search"/>
					</Input>
                    &nbsp;&nbsp;&nbsp;
                    <Select v-model="config.authority" style="width:200px" @on-change="searchAuto">
                        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
            </div>
            <Table size="small" :data="search_list" :loading="loading" :columns="columns" border style="margin-top: 15px">
                <template slot-scope="{ row, index }" slot="name">
					{{row.user.name}}
				</template>
				<template slot-scope="{ row, index }" slot="email">
					{{row.user.email}}
				</template>
                <template slot-scope="{ row }" slot="authorities">
					<span v-for="(item,key) in row.authorities" :key="key">
                        {{item.authority | accountAccess}}&nbsp;<span v-if="key != row.authorities.length - 1">，</span>
                    </span>
				</template>
				<template slot-scope="{ row, index }" slot="enable">
					<Tag color="success" v-if="row.user.enabled">正常</Tag>
					<Tag color="error" v-else>禁止登录</Tag>
				</template>
                <template slot-scope="{ row, index }" slot="handler">
					<Button type="primary" ghost size="small" @click="permissions(row)">权限管理</Button>
				</template>
            </Table>
            <Pagination :total="total" :pageSize="config.pageSize" @pageChange="pageChange" @pageSizeChange="pageSizeChange"></Pagination>
            <Modal
                v-model="modal1"
                title="权限设置"
                width="20%"
                :closable="false"
                @on-ok="ok"
                @on-cancel="cancel">
                <div class="AJM_modal">
                    <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                        <Checkbox label="OKR-ADMIN">OKR系统管理员</Checkbox>
                        <Checkbox label="EPC-ADMIN">文化系统管理员</Checkbox>
                        <Checkbox label="QUESTIONNAIRE-ADMIN">文化之星管理员</Checkbox>
                        <Checkbox label="PES-ADMIN">绩效系统管理员</Checkbox>
                        <Checkbox label="HOME-ADMIN">内部官网管理员</Checkbox>
                        <Checkbox label="TALK-ADMIN">绩效系统管理员</Checkbox>
                        <Checkbox label="ASSETS-ADMIN">资产系统管理员</Checkbox>
                        <Checkbox label="SSO-ADMIN" :disabled="!superAdmin()">SSO系统管理员</Checkbox>
                        <Checkbox label="CEO" :disabled="!superAdmin()">首席执行官</Checkbox>
                        <Checkbox label="HR_VP" :disabled="!superAdmin()">人力资源副总裁</Checkbox>
                        <Checkbox label="HR_BP_LEADER" :disabled="!superAdmin()">HRBP HEAD</Checkbox>
                    </CheckboxGroup>
                </div>
            </Modal>
        </Card>
    </div>
</template>

<script>
import searchUserPageErrorHandler from "@/error/user/search-user-page-error-handler";
import insertUserErrorHandler from "@/error/user/insert-user-error-handler";
import commonData from "@/config/common-data";

let timeOutInstance = null;

export default {
data() {
    return {
        loading: false,
        checkAllGroup: [],
        modal1: false,
        config: {
            searchStr: "",
            authority: "ALL",
            page: 1,
            pageSize: 10
        },
        total: 0,
        cityList: [
            {
                value: 'OKR-ADMIN',
                label: 'OKR系统管理员'
            },
            {
              value: 'EPC-ADMIN',
              label: '文化系统管理员'
            },
            {
              value: 'QUESTIONNAIRE-ADMIN',
              label: '文化之星管理员'
            },
            {
                value: 'PES-ADMIN ',
                label: '绩效系统管理员'
            },
            {
              value: 'TALK-ADMIN ',
              label: '绩效系统管理员'
            },
            {
              value: 'HOME-ADMIN ',
              label: '内部官网管理员'
            },
            {
              value: 'ASSETS-ADMIN ',
              label: '资产系统管理员'
            },
            {
                value: 'SSO-ADMIN',
                label: 'SSO系统管理员'
            },{
                value: 'CEO',
                label: '首席执行官'
            },
            {
              value: 'HR_VP',
              label: '人力资源副总裁'
            },
            {
              value: 'HR_BP_LEADER',
              label: 'HRBP HEAD'
            },
            {
                value: 'ALL',
                label: '全部'
            }
        ],
        columns: [
            {
                title: '用户名',
                key: 'username',
				minWidth: 150
            },
            {
                title: '姓名',
                slot: 'name',
				minWidth: 150
            },
            {
                title: '邮箱',
                slot: 'email',
                minWidth: 200
            },
            {
                title: '账号权限',
                slot: 'authorities',
                minWidth: 300
            },
            {
                title: '状态',
                slot: 'enable',
				minWidth: 120
            },
            {
                title: '操作',
                slot: 'handler',
                minWidth: 150
            }
        ],
        search_list: [],
        userId: ''
    };
},
components: {},
computed: {},
watch: {},
methods: {
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
    },
    permissions(row) {
        this.userId = row.user.id;
        this.checkAllGroup = [];
        for (let i = 0; i < row.authorities.length; i++) {
            this.checkAllGroup.push(row.authorities[i].authority)
        }
        this.modal1 = true;
    },
    searchAuto(){
        if (timeOutInstance) {
            clearTimeout(timeOutInstance);
        }
        timeOutInstance = setTimeout(()=>{
            this.config.page = 1;
			this.config.pageSize = 10;
            this.search();
        },500)
    },
    search() {
        let data = JSON.parse(JSON.stringify(this.config).replace("ALL",""))
        this.loading = true;
        this.$axios({
            url: this.$server_address + '/user/searchUserPage',
            method: 'post',
            data: data,
            'hide-spin':true,
        }).then(res => {
            this.loading = false;
            this.total = res.data.totalElements;
            this.$data.search_list = res.data.content;
        }).catch(err => {
            this.loading = false;
            searchUserPageErrorHandler(err);
        })
    },
    checkAllGroupChange (data) {
        if (data.length === 3) {
            this.indeterminate = false;
            this.checkAll = true;
        } else if (data.length > 0) {
            this.indeterminate = true;
            this.checkAll = false;
        } else {
            this.indeterminate = false;
            this.checkAll = false;
        }
    },
    ok () {
        let data = {
            userId: this.userId,
            authorityList: this.checkAllGroup
        }
        this.$axios({
            url: this.$server_address + '/user/updateUserDetailAuthority',
            method: 'post',
            data: data
        }).then(() => {
            this.$Message.success('修改权限成功');
            this.modal1 = false;
            this.search();
        }).catch(err => {
            insertUserErrorHandler(err);
        })
    },
    cancel () {
        // this.$Message.info('取消修改');
    },
    pageSizeChange(size) {
        this.config.pageSize = size;
        this.search();
    },
    pageChange(page) {
        this.config.page = page;
        this.search();
    },
},
created() {
    this.search()
},
mounted() {

},
beforeCreate() {}, //生命周期 - 创建之前
beforeMount() {}, //生命周期 - 挂载之前
beforeUpdate() {}, //生命周期 - 更新之前
updated() {}, //生命周期 - 更新之后
beforeDestroy() {}, //生命周期 - 销毁之前
destroyed() {}, //生命周期 - 销毁完成
activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>