<template>
	<div>
		<Input v-model="filter" placeholder="输入用户名或姓名查找用户"></Input>
		<div class="content">
			<Tag type="dot" class="user-tag" closable :color="filtrate(item)?'error':'success'"
				 v-for="(item,index) in data_list" :key="index" @on-close="removeUserDepartmentLink(item)">
				{{ item.user.name }} ({{item.user.username}})
			</Tag>
			<Button type="primary" class="user-tag" ghost @click="modal=true">新增用户</Button>
		</div>
		<Modal v-model="modal" title="选择用户" @on-ok="insertUserDepartmentLink">
			<Select
				v-model="userId"
				filterable
				:remote-method="searchUser"
				:loading="user_loading">
				<Option v-for="(option, index) in user_list" :value="option.user.id" :key="index"
						:label="option.user.name+' ('+option.user.username+')'"/>
			</Select>
		</Modal>
	</div>
</template>

<script>
import selectUserListByDepartmentErrorHandler from "@/error/user/select-user-list-by-department-error-handler";
import searchUserPageErrorHandler from "@/error/user/search-user-page-error-handler";
import insertAuthorityErrorHandler from "@/error/user/insert-authority-error-handler";
import commonData from "@/config/common-data";
import insertUserDepartmentLinkErrorHandler from "@/error/user/insert-user-department-link-error-handler";
import removeUserDepartmentLinkErrorHandler from "@/error/user/remove-user-department-link-error-handler";
let timeOutInstance = null;

export default {
	name: "adminDepartmentUser",
	props: {
		node: {
			type: Object,
			required: true,
		}
	},
	data(){
		return {
			data_list:[],
			filter:'',
			userId: null,
			modal: false,
			user_loading: false,
			user_list:[],
		}
	},
	computed: {
		filtrate() {
			return (item) => {
				return this.$data.filter.length > 0 && (item.user.username.indexOf(this.$data.filter) !== -1 || item.user.name.indexOf(this.$data.filter) !== -1);
			}
		}
	},
	methods:{
		select(){
			this.$axios({
				url: this.$server_address + '/user/selectUserListByDepartment/' + this.$props.node.baseInfo.id,
				method: 'post',
				'hide-spin': true,
			}).then(res => {
				this.$data.data_list = res.data;
			}).catch(err => {
				selectUserListByDepartmentErrorHandler(err)
			})
		},
		insertUserDepartmentLink(){
			if (this.$data.userId) {
				this.$axios({
					url: this.$server_address + '/user/insertUserDepartmentLink',
					method: 'post',
					data: {
						userId: this.$data.userId,
						departmentId: this.$props.node.baseInfo.id,
					}
				}).then(() => {
					this.$Message.success("操作成功")
					this.select();
					this.$data.userId = null;
				}).catch(err => {
					insertUserDepartmentLinkErrorHandler(err);
				})
			} else {
				this.$Message.error("操作失败！请选择用户")
			}
		},
		removeUserDepartmentLink(item){
			commonData.system_confirm_modal.open({
				title: '确认移除用户',
				content: '您确认在当前部门移除此用户吗？',
				onOk: () => {
					this.$axios({
						url: this.$server_address + '/user/removeUserDepartmentLink',
						method: 'post',
						data: {
							userId: item.user.id,
							departmentId: this.$props.node.baseInfo.id,
						}
					}).then(() => {
						this.$Message.success("操作成功")
						this.select();
					}).catch(err => {
						removeUserDepartmentLinkErrorHandler(err);
					})
				},
			});
		},
		searchUser(query) {
			if (query) {
				this.$data.user_loading = true;
				if (timeOutInstance) {
					clearTimeout(timeOutInstance);
				}
				timeOutInstance = setTimeout(() => {
					this.$axios({
						url: this.$server_address + '/user/searchUserPage',
						method: 'post',
						data: {
							searchStr:query,
							page: 1,
							pageSize: 20
						},
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
	},
	watch:{
		node(){
			this.select();
		}
	},
	created() {
		this.select();
	}
}
</script>

<style scoped>
.user-tag {
	margin: 8px;
}
.content {
	margin-top: 15px;
	border-radius: 5px;
	border: 1px solid #DDD;
}
</style>