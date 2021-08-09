<template>
	<div>
		<Form v-if="data" label-position="top" :model="data" ref="departmentForm" :rules="departmentFormRule">
			<FormItem label="部门名称" prop="name">
				<Input placeholder="请填写部门名称" v-model="data.name"></Input>
			</FormItem>
			<FormItem label="部门LEADER" prop="leaderId">
				<Select
					v-model="data.leaderId"
					filterable :remote-method="searchDUser"
					:loading="user_loading">
					<Option v-for="(option, index) in user_list" :value="option.user.id" :key="index"
							:label="option.user.name+' ('+option.user.username+')'"/>
				</Select>
			</FormItem>
			<FormItem label="部门HRBP" prop="hrBpId">
				<Select
					v-model="data.hrBpId"
					filterable :remote-method="searchDUser"
					:loading="user_loading">
					<Option v-for="(option, index) in user_list" :value="option.user.id" :key="index"
							:label="option.user.name+' ('+option.user.username+')'"/>
				</Select>
			</FormItem>
		</Form>
	</div>
</template>

<script>
import searchUserPageErrorHandler from "@/error/user/search-user-page-error-handler";
import checkDepartmentNameUniqueErrorHandler from "@/error/user/check-department-name-unique-error-handler";
import selectSSOUserByIdListLocal from "@/config/sso-user-local";

let timeOutInstance = null;
export default {
	name: "adminInsertDepartmentForm",
	data() {
		return {
			user_loading: false,
			user_list: [],
			data: null,
			departmentFormRule: {
				name: [
					{required: true, message: '必须填写部门名称', trigger: 'blur'},
					{
						trigger: 'blur', validator: (rule, value, callback) => {
							if (value !== this.$props.initData.name) {
								this.$axios({
									url: this.$server_address + '/user/checkDepartmentNameUnique',
									data: {
										parentId: this.$data.data.parentId,
										name: this.$data.data.name,
									},
									method: 'post',
									'hide-spin': true
								}).then(() => {
									callback();
								}).catch(err => {
									checkDepartmentNameUniqueErrorHandler(err, (error) => {
										callback(error);
									})
								})
							} else {
								callback();
							}
						}
					},
				],
				leaderId: [
					{required: true, message: '必须填写LEDAER', trigger: 'blur'},
				],
				hrBpId: [
					{required: true, message: '必须填写HRBP', trigger: 'blur'},
				],
			}
		}
	},
	props: {
		initData: {
			type: Object,
			default() {
				return {
					id: null,
					companyId: null,
					name: '',
					parentId: null,
					root: null,
					hrBpId: null,
					leaderId: null,
				};
			}
		},
	},
	methods: {
		init() {
			selectSSOUserByIdListLocal([this.$props.initData.leaderId, this.$props.initData.hrBpId], (res) => {
				if (res[this.$props.initData.leaderId]) {
					this.$data.user_list.push(res[this.$props.initData.leaderId])
				}
				if (res[this.$props.initData.hrBpId]) {
					this.$data.user_list.push(res[this.$props.initData.hrBpId])
				}
				this.$data.data = JSON.parse(JSON.stringify(this.$props.initData));
			});
		},
		convertOut() {
			return JSON.parse(JSON.stringify(this.$data.data));
		},
		searchDUser(query) {
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
							searchStr: query,
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
	watch: {
		initData: {
			handler() {
				this.init()
			},
			deep: true,
		}
	},
	created() {
		this.init()
	},
}
</script>

<style scoped>

</style>