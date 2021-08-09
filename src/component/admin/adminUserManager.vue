<style lang="less" scoped>
.write {
	width: 100%;
	.header {
		height: 62px;
		border: 1px solid #eee;
		padding: 12px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		span {
			margin-left: 15px;
		}
	}
	.form {
		margin-top: 8px;
		border: 1px solid #eee;
		padding: 12px;
		box-sizing: border-box;
	}
	.footer {
		width: 100%;
		padding-left: 120px;
	}
}
.main {
	display: flex;
	align-items: self-end;
	justify-content: space-between;
	// height: 75px;
	.main-R {
		display: flex;
		align-items: self-end;
		height: 100%;
		.mR_up {
			width: 100px;
			text-align: right;
			// margin: 0 10px;
		}
		.mR_template {
			width: 88px;
			height: 32px;
			line-height: 32px;
			text-align: center;
		}
	}
	.slotRow {
		text-align: center;
	}
}
</style>

<style lang="less">
	.modal_err {
		width: 100%;
		max-height: 500px;
		overflow-y: auto;
		p {
			line-height: 28px;
		}
	}
	.mR_up .ivu-upload-list {
		width: 200%;
	}
	.adminModal {
		p {
			margin: 15px 0px;
		}
	}
</style>

<template>
	<div>
		<Card dis-hover :title="formType ? '编辑用户' : '创建用户'" v-if="userType">
			<div class="write">
				<div class="header"><Button size="small" @click="returnTo()"><Icon type="ios-arrow-back"></Icon>返回</Button><span>{{formType ? '编辑' : '添加'}}账号</span></div>
				<div class="form">
					<Form ref="insertUserForm" :label-width="90" :model="insertUserForm" :rules="insertUserFormRules">
						<FormItem label="用户名" prop="username">
							<Input v-model="insertUserForm.username" placeholder="请输入用户名" style="width: 330px" :disabled="formType"></Input>
						</FormItem>
						<FormItem label="姓名" prop="name">
							<Input v-model="insertUserForm.name" placeholder="姓名" style="width: 330px"></Input>
						</FormItem>
						<FormItem label="邮箱地址" prop="email">
							<Input v-model="insertUserForm.email" placeholder="请输入邮箱地址" style="width: 150px"></Input>
							<span style="margin:0 8px">@</span>
							<Select v-model="emailName" style="width: 150px">
								<Option v-for="item in emailList" :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
						</FormItem>
						<FormItem label="账号权限" prop="role">
							<Select v-model="authorityList" multiple style="width: 330px">
								<Option v-for="item in roleList" :value="item.value" :key="item.value" :disabled="item.disabled">{{ item.label }}</Option>
							</Select>
						</FormItem>
						<FormItem label="密码" prop="password" v-if="formType">
							<Input v-model="insertUserForm.password" placeholder="请修改初始密码" style="width: 330px"></Input>
						</FormItem>
						<FormItem :label="'部门'" v-for="(item,key) in departmentArr" :key="key + '1'">
							<Cascader v-model="item.id" :data="departmentList" filterable style="width: 330px;display: inline-block;" change-on-select></Cascader>
							<span style="margin:0 4px"></span>
							<Button type="primary" shape="circle" size="small" icon="md-add" @click="quantityAdd('departmentArr')"></Button>
							<span style="margin:0 4px"></span>
							<Button v-if="key > 0" type="primary" shape="circle" size="small" icon="md-remove" @click="quantityRemove('departmentArr',key)"></Button>
						</FormItem>
						<FormItem :label="key > 0 ? '职位' + key : '职位'" v-for="(item,key) in positionArr" :key="key">
							<Input v-model="insertUserForm.userStaff" placeholder="请输入职位" style="width: 330px"></Input>
							<!-- <span style="margin:0 4px"></span>
							<Button type="primary" shape="circle" size="small" icon="md-add" @click="quantityAdd('positionArr')"></Button>
							<span style="margin:0 4px"></span>
							<Button v-if="key > 0" type="primary" shape="circle" size="small" icon="md-remove" @click="quantityRemove('positionArr',key)"></Button> -->
						</FormItem>
						<FormItem label="员工状态" v-if="formType">
							<Select v-model="insertUserForm.userStatus" style="width: 330px">
								<Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
						</FormItem>
						<FormItem label="用户类别">
							<Select v-model="insertUserForm.userType" style="width: 330px">
								<Option v-for="item in rankList" :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
						</FormItem>
						<FormItem label="JIRA用户组">
							<Select v-model="jiraUserGroupNameList" style="width: 330px" filterable multiple :disabled="formType">
								<Option v-for="item in jiraUserGroupList" :value="item.html" :key="item.html">{{ item.name }}</Option>
							</Select>
						</FormItem>
						<div class="footer">
							<Button class="user-form-button" @click="cancel('insertUserForm')">取消</Button>
							<Button class="user-form-button" v-if="!formType" type="primary" @click="insert">添加</Button>
							<Button class="user-form-button" v-if="formType" type="primary" @click="save">保存</Button>
						</div>
					</Form>
				</div>
			</div>
		</Card>
		<Card dis-hover title="用户管理" v-else style="margin-top: 15px">
			<div class="main">
				<div>
					<Input placeholder="搜索用户" v-model="config.searchStr" style="width: 200px" @on-change="searchAuto">
						<Icon type="ios-search" slot="suffix" style="cursor: pointer" @click.native="search"/>
					</Input>
					<span style="margin:0 4px"></span>
					<Select v-model="config.userStatus" style="width:200px" @on-change="searchAuto">
						<Option v-for="item in searchList" :value="item.value" :key="item.value">{{ item.label }}</Option>
					</Select>
					<span style="margin:0 4px"></span>
					<Button type="primary" @click="batchExAllport">账号导出</Button>
				</div>
				<div class="main-R">
					<Button type="primary" @click="addAdmin">添加账号</Button>
					<span style="margin:0 4px"></span>
					<Button type="primary" @click="batchAdd('/file/insertUserList','批量添加')">批量导入</Button>
					<!-- <span style="margin:0 4px"></span>
					<Button type="primary" @click="batchAdd('/file/updateUserList', '批量修改')">批量修改</Button> -->
					<!-- <div class="mR_up">
						<Upload :action="$server_address + '/file/insertUserList'" ref="Uploader" :max-size="10240" accept=".xls,.xlsx" :before-upload="handleUpload" :on-success="handleSuccess" :on-error="handleError" with-credentials>
							<Button type="primary">批量添加</Button>
						</Upload>
					</div>
					<div class="mR_up">
						<Upload :action="$server_address + '/file/updateUserList'" ref="Uploader1" :max-size="10240" accept=".xls,.xlsx" :before-upload="handleUpload" :on-success="handleSuccess" :on-error="handleError" with-credentials>
							<Button type="primary">批量修改</Button>
						</Upload>
					</div>
					<div class="mR_template"><a :href="$server_address + '/file/resource/userInsert.xlsx'">模板下载</a></div> -->
					<span style="margin:0 4px"></span>
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
					<!-- {{row.authorities}} -->
					<span v-for="(item,key) in row.authorities" :key="key">
                        {{item.authority | accountAccess}}&nbsp;<span v-if="key != row.authorities.length - 1">，</span>
                    </span>
				</template>
				<template slot-scope="{ row, index }" slot="enable">
					<div class="slotRow">
						<Tag color="success" v-if="row.user.enabled">正常</Tag>
						<Tag color="error" v-else>禁止登录</Tag>
					</div>
				</template>
				<template slot-scope="{ row, index }" slot="userStaff">
					{{row.user.userStaff}}
				</template>
				<template slot-scope="{ row, index }" slot="departments">
					<span v-for="(item,key) in row.departments" :key="key">
                        {{item | filtrateDepartment}}&nbsp;<span v-if="key != row.departments.length - 1">，</span>
                    </span>
				</template>
				<template slot-scope="{ row, index }" slot="userStatus">
					<div class="slotRow">
						<Tag color="success" v-if="row.user.userStatus == 'NORMAL'">在职</Tag>
						<Tag color="error" v-else>离职</Tag>
					</div>
				</template>
				<template slot-scope="{ row, index }" slot="userType">
					<div class="slotRow">
						<Tag color="primary" v-if="row.user.userType == 'FORMAL'">正式</Tag>
						<Tag color="primary" v-else>实习</Tag>
					</div>
				</template>
				<template slot-scope="{ row, index }" slot="handler">
					<Button type="error" ghost size="small" v-if="row.user.enabled" @click="disableUser(row.user.id)">停用</Button>
					<Button type="success" ghost size="small" v-else @click="enableUser(row.user.id)">启用</Button>
					<Button type="primary" size="small" style="margin-left: 5px" @click="redact(row)">编辑</Button>
				</template>
			</Table>
			<Pagination :total="total" :current="config.page" :pageSize="config.pageSize" @pageChange="pageChange" @pageSizeChange="pageSizeChange"></Pagination>
			<Modal
				v-model="uploadModal"
				:loading="downloading"
				:mask-closable="false"
				@on-ok="onConfirm"
				@on-cancel="onCancel">
				<div class="adminModal">
					<Tabs v-model="modalVal">
						<TabPane label="批量添加" name="Uploader">
							<p>第一步：导出人员信息表用于备份</p>
							<Button type="primary" @click="batchExport('124')" :disabled="exportKey.indexOf('1') == -1">账号导出</Button>
							<p>第二步：下载模板表格</p>
							<Button type="primary" :to="$server_address + '/file/resource/userInsert.xlsx'" @click="exportKey = '1234'" :disabled="exportKey.indexOf('2') == -1">模板下载</Button>
							<p>第三步：上传添加的人员信息表</p>
							<Upload :action="$server_address + '/file/insertUserList'" :before-upload="handleUpload" ref="Uploader" :max-size="10240" accept=".xls,.xlsx" :on-success="handleSuccess" :on-error="handleError" with-credentials>
								<Button type="primary" :disabled="exportKey.indexOf('3') == -1">{{file == null ? '批量上传' : '重新上传'}}</Button>
							</Upload>
							<span>&nbsp;&nbsp;{{file != null ? file.name : ''}}</span>
							<p>仅支持xls、xlsx格式</p>
						</TabPane>
						<TabPane label="批量修改" name="Uploader1">
							<p>第一步：导出人员信息表用于备份</p>
							<Button type="primary" @click="batchExport('145')" :disabled="exportKey.indexOf('4') == -1">账号导出</Button>
							<p>第二步：下载模板表格</p>
							<Button type="primary" :to="$server_address + '/file/resource/userInsert.xlsx'" @click="exportKey = '1456'" :disabled="exportKey.indexOf('5') == -1">模板下载</Button>
							<p>第三步：上传修改的人员信息表</p>
							<Upload :action="$server_address + '/file/updateUserList'" :before-upload="handleUpload" ref="Uploader1" :max-size="10240" accept=".xls,.xlsx" :on-success="handleSuccess" :on-error="handleError" with-credentials>
								<Button type="primary" :disabled="exportKey.indexOf('6') == -1">{{file == null ? '批量上传' : '重新上传'}}</Button>
							</Upload>
							<span>&nbsp;&nbsp;{{file != null ? file.name : ''}}</span>
							<p>仅支持xls、xlsx格式</p>
						</TabPane>
					</Tabs>
				</div>
			</Modal>
		</Card>
	</div>
</template>

<script>
import checkUsernameUniqueErrorHandler from "@/error/user/check-username-unique-error-handler";
import searchUserPageErrorHandler from "@/error/user/search-user-page-error-handler";
import insertUserErrorHandler from "@/error/user/insert-user-error-handler";
import enableUserErrorHandler from "@/error/user/enable-user-error-handler";
import modifyThePermissions from "@/error/user/modify-the-permissions";
import detectionUploadError from "@/error/user/detection-upload-error";
import disableUserErrorHandler from "@/error/user/disable-user-error-handler";
import commonData from "@/config/common-data";
import md5 from "js-md5";
import fileDownload from 'js-file-download'

let timeOutInstance = null;

export default {
	name: "adminUserManager",
	data() {
		let _this = this;
		return {
			modalVal: 'Uploader',
			file: null,
			exportKey: '14',
			loading: false,
			actionUrl: '',
			downloadTitle:'',
			downloading: true,
			uploadModal: false,
			formType: false,
			userType: false,
			stateList:[
				{
					value: 'NORMAL',
					label: '在职'
				},{
					value: 'DISMISSION',
					label: '离职'
				}
			],
			searchList:[
				{
					value: 'ALL',
					label: '全部'
				},{
					value: 'NORMAL',
					label: '在职'
				},{
					value: 'DISMISSION',
					label: '离职'
				}
			],
			emailName: 'game2sky.com',
			emailList: [
				{
					value: 'game2sky.com',
					label: 'game2sky.com'
				},{
					value: 'pkwangame.com',
					label: 'pkwangame.com'
				}
			],
			roleList:[
				{
					value: 'OKR-ADMIN',
					label: 'OKR系统管理员',
					disabled: false
				},
				{
					value: 'EPC-ADMIN',
					label: '文化系统管理员',
					disabled: false
				},
				{
					value: 'QUESTIONNAIRE-ADMIN',
					label: '文化之星管理员',
					disabled: false
				},
				{
					value: 'PES-ADMIN',
					label: '绩效系统管理员',
					disabled: false
				},
				{
					value: 'HOME-ADMIN',
					label: '内部官网管理员',
					disabled: false
				},
				{
					value: 'TALK-ADMIN',
					label: '面谈系统管理员',
					disabled: false
				},
				{
					value: 'ASSETS-ADMIN',
					label: '资产系统管理员',
					disabled: false
				},
				{
					value: 'SSO-SUPER-ADMIN',
					label: '超级系统管理员',
					disabled: true
				},
				{
					value: 'SSO-ADMIN',
					label: 'SSO系统管理员',
					disabled: !this.superAdmin()
				},{
					value: 'CEO',
					label: '首席执行官',
					disabled: !this.superAdmin()
				},
				{
					value: 'HR_VP',
					label: '人力资源副总裁',
					disabled: !this.superAdmin()
				},
				{
					value: 'HR_BP_LEADER',
					label: 'HRBP HEAD',
					disabled: !this.superAdmin()
				},
			],
			rankList:[
				{
					value: 'FORMAL',
					label: '正式员工'
				},{
					value: 'INNERSHIP',
					label: '实习员工'
				}
			],
			jiraUserGroupList: [],
			departmentList:[],
			columns:[
				{
					title: '用户名',
					key: 'username',
					minWidth: 150,
					fixed: 'left'
				},
				{
					title: '姓名',
					slot: 'name',
					minWidth: 150
				},
				{
					title: '邮箱',
					slot: 'email',
					minWidth: 220
				},
				{
					title: '账号权限',
					slot: 'authorities',
					minWidth: 300
				},
				{
					title: '账号状态',
					slot: 'enable',
					minWidth: 120
				},
				{
					title: '职位',
					slot: 'userStaff',
					minWidth: 150
				},
				{
					title: '部门',
					slot: 'departments',
					minWidth: 300
				},
				{
					title: '员工状态',
					slot: 'userStatus',
					minWidth: 100
				},
				{
					title: '用户类别',
					slot: 'userType',
					minWidth: 100
				},
				{
					title: '操作',
					slot: 'handler',
					minWidth: 135,
					fixed: 'right'
				},
			],
			config: {
				searchStr: "",
				userStatus: 'ALL',
				page: 1,
				pageSize: 10
			},
			total: 0,
			search_list: [],
			insertUserForm: {
				username: '',
				password: '',
				name: '',
				email: '',
				userStaff: '',
			},
			authorityList: [],
			departmentIdList: [],
			jiraUserGroupNameList: [],
			positionArr:[
				{
					name: ''
				}
			],
			departmentArr:[
				{
					id: []
				}
			],
			insertUserFormRules: {
				username: [
					{required: true, message: '用户名不能为空', trigger: 'blur'},
					{min: 1, max: 20, message: '用户名不能超过20个字符', trigger: 'blur'},
					{pattern:/^[A-Za-z][\w-_.]{0,19}$/, message: '用户名只支持字母和数字，且必须字母开头', trigger: 'blur'},
					{
						trigger: 'blur', validator: (rule, value, callback) => {
							if (this.formType) {
								return callback();
							}
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
					// {pattern:/^[\w_\-.]+@game2sky.com$/, message: '邮箱必须满足XXX.@game2sky.com', trigger: 'blur'},
				],
				password: [
					{required: true, message: '密码不能为空', trigger: 'blur'},
				],

			}
		}
	},
	watch:{

	},
	created() {
		this.search();
	},
	mounted() {
		if (sessionStorage.getItem('departmentList')) {
			let departmentList = JSON.parse(sessionStorage.getItem('departmentList'))
			let data = JSON.parse(JSON.stringify(departmentList).replace(/title/g, 'label'));
			this.departmentList = JSON.parse(JSON.stringify(data).replace(/id/g, 'value'));
			// console.log(this.departmentList,'我是缓存部门数据')
		}else {
			this.selectAllDepartment()
		}
	},
	methods: {
		// jira用户列表查询
		selectJIRAUserGroupPost() {
			this.$axios({
				url: this.$server_address + '/user/selectJIRAUserGroup',
				method: 'post',
				data: {}
			}).then(res => {
				this.jiraUserGroupList = res.data
			}).catch(err => {
				// console.log(err)
			})
		},
		addAdmin () {
			this.jiraUserGroupNameList = [];
			this.formType = false;
			this.userType = true;
			this.selectAllDepartment();
			this.selectJIRAUserGroupPost();
		},
		handleUpload (file) {
			this.file = file;
			return false;
		},
		onConfirm () {
			if (this.file !== null) {
				this.$refs[this.modalVal].post(this.file)
			}else {
				this.downloading = false;
				this.uploadModal = false;
				this.exportKey = '14';
			}
		},
		onCancel () {
			if (this.file) {
				this.$refs[this.modalVal].clearFiles();
				this.file = null;
			}
			this.exportKey = '14';
		},
		addDate() {
			let nowDate = new Date();
			let date = {
				year: nowDate.getFullYear(),
				month: nowDate.getMonth() + 1,
				date: nowDate.getDate(),
				hh: nowDate.getHours(),
				mf: nowDate.getMinutes()<10 ? '0'+ nowDate.getMinutes() : nowDate.getMinutes()
			}
			return date.year + '年' + date.month + '月' + date.date + '日' + date.hh + '时' + date.mf + '分';
		},
		batchAdd(val,name) {
			this.downloadTitle = name;
			this.uploadModal = true;
			this.actionUrl = this.$server_address + val;
		},
		// 文件上传失败
		handleError(error, file, fileList) {
			this.$refs[this.modalVal].clearFiles();
			this.file = null;
			this.downloading = false;
			this.uploadModal = false;
			this.exportKey = '14';
			if (error.status == 406) {
				let errs = [];
				for (let i = 0; i < file.length; i++) {
					for (let j = 0; j < file[i].errorList.length; j++) {
						let err = '<p>第' + file[i].row + '行 ' + file[i].errorList[j] + '</p>';
						errs.push(err)
					}
				}
				errs.unshift('<div class="modal_err">');
				errs.push('</div>');
				const title = '错误提示';
				const content = errs.join('');
				this.$Modal.error({
					title: title,
					content: content,
					width: 500,
					transfer: false
				});
			}else {
				detectionUploadError(error);
			}
		},
		// 文件批量上传成功
		handleSuccess(response, file, fileList) {
			// console.log(response, file, fileList)
			const title = '导入成功';
			const content = '所有用户信息已导入';
			this.file = null;
			this.downloading = false;
			this.uploadModal = false;
			this.exportKey = '14';
			this.$Modal.success({
				title: title,
				content: content,
				width: 500
			});
			this.$refs[this.modalVal].clearFiles();
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
		},
		// 导出
		batchExport(key) {
			let data = JSON.parse(JSON.stringify(this.config));
			data.pageSize = 1000;
			if (data.userStatus == 'ALL') {
				data.userStatus = ''
			}
			this.$axios({
				url: this.$server_address + '/file/exportUserList',
				method: 'post',
				data: data,
				responseType: 'blob'
			}).then(res => {
				// console.log(res)
				if (!res.data) {
					return
				}
				this.exportKey = key;
				let name = this.addDate() + '人员导出表.xlsx';
				fileDownload(res.data, name)
			}).catch(err => {
				// console.log(err)
			})
		},
		batchExAllport() {
			let data = JSON.parse(JSON.stringify(this.config));
			data.pageSize = 1000;
			data.page = 1;
			if (data.userStatus == 'ALL') {
				data.userStatus = ''
			}
			this.$axios({
				url: this.$server_address + '/file/exportUserList',
				method: 'post',
				data: data,
				responseType: 'blob'
			}).then(res => {
				// console.log(res)
				if (!res.data) {
					return
				}
				let name = this.addDate() + '人员导出表.xlsx'
				fileDownload(res.data, name)
			}).catch(err => {
				// console.log(err)
			})
		},
		// 编辑
		redact(row) {
			let email = row.user.email.split('@');
			this.insertUserForm = row.user;
			this.insertUserForm.email = email[0];
			this.emailName = email[1];
			this.authorityList = [];
			for (let i = 0; i < row.authorities.length; i++) {
				this.authorityList.push(row.authorities[i].authority)
			}
			this.departmentIdList = [];
			this.departmentArr = [];
			for (let j = 0; j < row.departments.length; j++) {
				let key = row.departments[j].length - 1;
				this.departmentIdList.push(row.departments[j][key].id);
				let obj = {
					id:[]
				};
				for (let i = 0; i < row.departments[j].length; i++) {
					obj.id.push(row.departments[j][i].id)
				}
				this.departmentArr.push(obj)
			}
			if (this.departmentArr.length == 0) {
				this.departmentArr = [
					{
						id:[]
					}
				];
			}
			let obj = {
				'insertUserForm': this.insertUserForm,
				'emailName': this.emailName,
				'authorityList': this.authorityList,
				'departmentArr': this.departmentArr,
			}
			sessionStorage.setItem('initialObj',JSON.stringify(obj))
			this.formType = true;
			this.userType = true;
			this.selectAllDepartment();
			this.selectJIRAUserPost(row.username);
			this.selectJIRAUserGroupPost();
		},
		// 查询JIRA用户组
		selectJIRAUserPost(name) {
			this.$axios({
				url: this.$server_address + '/user/selectJIRAUser/' + name,
				method: 'post',
			}).then(res => {
				// console.log(res.data.groups.items,'JIRA')
				this.jiraUserGroupNameList = res.data.groups.items.map( (item) => {
					return item.name
				})
			}).catch(err => {
				// console.log(err)
			})
		},
		// 请求部门数据
		selectAllDepartment() {
			this.$axios({
				url: this.$server_address + '/user/selectDepartmentTree/1',
				method: 'post',
			}).then(res => {
				let departmentList = res.data.children[0].children;
				sessionStorage.setItem('departmentList',JSON.stringify(departmentList));
				let data = JSON.parse(JSON.stringify(departmentList).replace(/title/g, 'label'));
				this.departmentList = JSON.parse(JSON.stringify(data).replace(/id/g, 'value'));
				// console.log(this.departmentList,'我是请求部门数据')
			}).catch(err => {
				// console.log(err)
			})
		},
		pageSizeChange(size) {
			this.config.pageSize = size;
			this.search();
		},
		pageChange(page) {
			this.config.page = page;
			this.search();
			// console.log(page)
		},
		quantityAdd(name) {
			if (this[name].length < 10) {
				this[name].push({});
			}else {
				this.$Message.warning('最多添加十条');
			}
		},
		quantityRemove(name, key) {
			this[name].splice(key,1);
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
		returnTo() {
			this.$refs.insertUserForm.resetFields();
			this.insertUserForm = {
				username: '',
				password: '',
				name: '',
				email: '',
				userStaff: '',
				userStatus: '',
				userType: ''
			};
			this.emailName = 'game2sky.com';
			this.departmentArr = [
				{
					id: []
				}
			];
			this.authorityList = [];
			this.userType = false
		},
		cancel(name) {
			this.$Modal.confirm({
				title: '提示',
				content: '当前页面存在未保存的内容，点击确认会清空未保存的内容！',
				onOk: () => {
					if (this.formType) {
						let obj = JSON.parse(sessionStorage.getItem('initialObj'));
						this.insertUserForm = obj.insertUserForm;
						this.emailName = obj.emailName;
						this.departmentArr = obj.departmentArr;
						this.authorityList = obj.authorityList;
					}else {
						this.$refs[name].resetFields();
						this.insertUserForm = {
							username: '',
							password: '',
							name: '',
							email: '',
							userStaff: '',
							userStatus: '',
							userType: ''
						};
						this.emailName = 'game2sky.com';
						this.departmentArr = [
							{
								id: []
							}
						];
						this.authorityList = [];
					}

				},
				onCancel: () => {
					
				}
			});
			// this.userType = false
		},
		insert() {
			this.$refs.insertUserForm.validate(valid => {
				if (valid) {
					let userObj = {};
					for (const key in this.insertUserForm) {
						userObj[key] = this.insertUserForm[key]
					}
					userObj.email = this.insertUserForm.email + '@' + this.emailName;
					this.departmentIdList = []
					for (let index = 0; index < this.departmentArr.length; index++) {
						let i = this.departmentArr[index].id.length - 1;
						if (i >= 0) {
						this.departmentIdList.push(this.departmentArr[index].id[i])
						}
					}
					let data = {
						'user': userObj,
						'authorityList': this.authorityList,
						'departmentIdList': this.departmentIdList,
						'jiraUserGroupNameList': this.jiraUserGroupNameList
					}
					this.$axios({
						url: this.$server_address + '/user/insertUserDetail',
						method: 'post',
						data: data
					}).then(() => {
						// this.$Modal.success({
						// 	title: '注册成功',
						// 	content: '用户第一次登录，请执行找回密码流程'
						// });
						this.$Message.success('用户添加成功');
						this.$refs.insertUserForm.resetFields();
						this.insertUserForm = {
							username: '',
							password: '',
							name: '',
							email: '',
							userStaff: '',
							userStatus: '',
							userType: ''
						};
						this.emailName = 'game2sky.com';
						this.departmentArr = [
							{
								id: []
							}
						];
						this.authorityList = [];
						this.userType = false;
						this.search();
					}).catch(err => {
						modifyThePermissions(err);
					})
				}
			})
		},
		save() {
			this.$refs.insertUserForm.validate(valid => {
				if (valid) {
					
					let userObj = {};
					for (const key in this.insertUserForm) {
						userObj[key] = this.insertUserForm[key]
					}
					if (this.insertUserForm.password.indexOf('*') != -1) {
						userObj.password = null
					}else {
						userObj.password = md5(this.insertUserForm.password)
					}
					this.departmentIdList = []
					for (let index = 0; index < this.departmentArr.length; index++) {
						let i = this.departmentArr[index].id.length - 1;
						if (i >= 0) {
						this.departmentIdList.push(this.departmentArr[index].id[i])
						}
					}
					userObj.email = this.insertUserForm.email + '@' + this.emailName;
					let data = {
						'user': userObj,
						'authorityList': this.authorityList,
						'departmentIdList': this.departmentIdList,
						'jiraUserGroupNameList': this.jiraUserGroupNameList
					}
					this.$axios({
						url: this.$server_address + '/user/updateUserDetail',
						method: 'post',
						data: data
					}).then(() => {
						this.$Message.success('用户保存成功');
						this.$refs.insertUserForm.resetFields();
						this.insertUserForm = {
							username: '',
							password: '',
							name: '',
							email: '',
							userStaff: '',
							userStatus: '',
							userType: ''
						};
						this.emailName = 'game2sky.com';
						this.departmentArr = [
							{
								id: []
							}
						];
						this.authorityList = [];
						this.userType = false;
						this.search();
					}).catch(err => {
						modifyThePermissions(err);
					})
				}
			})
		}
	},
}
</script>

<style scoped>
.user-form-button {
	margin-left:15px;
}
.ivu-card-bordered {
	margin: 0 !important;
}
.ivu-upload {
	display: inline-block !important;
}
</style>