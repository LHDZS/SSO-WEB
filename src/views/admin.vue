<template>
	<div style="height: 100%">
		<div v-if="adminAuthority||superAdminAuthority" style="height: 100%;padding: 30px">
			<Card title="系统管理" class="yc-card" dis-hover>
				<Row :gutter="15" style="height: 100%">
					<Col span="4" style="height: 100%">
						<Button type="primary" ghost long @click="backToUser">返回个人中心</Button>
						<div class="yc-admin-menu">
							<div :class="{'yc-admin-menu-item':true,'yc-admin-menu-item-active':handler==='user'}"
								 @click="handler='user'">
								账户管理
							</div>
							<div :class="{'yc-admin-menu-item':true,'yc-admin-menu-item-active':handler==='authority'}"
								 @click="handler='authority'">
								权限管理
							</div>
							<div :class="{'yc-admin-menu-item':true,'yc-admin-menu-item-active':handler==='department'}"
								 @click="handler='department'">
								部门管理
							</div>
						</div>
					</Col>
					<Col span="20" style="height: 100%">
						<div class="yc-admin-content">
							<admin-user-manager v-if="handler==='user'"/>
							<admin-authority-manager v-if="handler==='authority'"/>
							<admin-department-manager v-if="handler==='department'"/>
						</div>
					</Col>
				</Row>
			</Card>
		</div>
		<common v-else>
			<Row type="flex" justify="center" align="top" style="height: 100%;text-align: center">
				<Col span="8">
					<Card dis-hover>
						您没有权限访问本页面，<a @click="backToUser">点此返回</a>
					</Card>
				</Col>
			</Row>
		</common>
	</div>
</template>

<script>
import UserPageStatusCheck from "@/mixins/userPageStatusCheck";
import AdminUserManager from "@/component/admin/adminUserManager";
import AdminAuthorityManager from "@/component/admin/adminAuthorityManager";
import AdminDepartmentManager from "@/component/admin/adminDepartmentManager";
import Common from "@/component/common";
import redirectToUser from "@/error/common/redirect-to-user";

export default {
	name: "admin",
	data() {
		return {
			handler: 'user'
		}
	},
	computed: {
		adminAuthority() {
			if (this.$data.user_info.authorities.length > 0) {
				for (let i = 0; i < this.$data.user_info.authorities.length; i++) {
					if (this.$data.user_info.authorities[i].authority === 'SSO-ADMIN') {
						return true;
					}
				}
			}
			return false;
		},
		superAdminAuthority() {
			if (this.$data.user_info.authorities.length > 0) {
				for (let i = 0; i < this.$data.user_info.authorities.length; i++) {
					if (this.$data.user_info.authorities[i].authority === 'SSO-SUPER-ADMIN') {
						return true;
					}
				}
			}
			return false;
		},
	},
	methods: {
		backToUser() {
			redirectToUser(this);
		}
	},
	mixins: [UserPageStatusCheck],
	components: {
		AdminUserManager, AdminAuthorityManager, Common, AdminDepartmentManager
	}
}
</script>

<style scoped>

.yc-admin-menu-item {
	padding: 15px;
	text-align: center;
	cursor: pointer;
	border: 2px solid #ffffff;
}

.yc-admin-menu-item-active {
	color: white;
	border: 2px solid #AAAAAA;
	background-color: #AAAAAA;
}

.yc-admin-menu-item:hover {
	border: 2px solid #AAAAAA;
}

.yc-card >>> .ivu-card-body {
	height: calc(100% - 60px);
}

.yc-admin-menu {
	border: 1px solid #CCCCCC;
	padding: 0 !important;
	margin-top: 15px;
}

.yc-admin-content {
	height: 100%;
	overflow-y: scroll;
	border: 1px solid #CCCCCC;
	padding: 0 8px 0 0;
}

.yc-admin-content::-webkit-scrollbar {
	width: 8px;
	height: 200px;
}

.yc-admin-content::-webkit-scrollbar-thumb {
	background: #808695;
}

.yc-admin-content::-webkit-scrollbar-track {
	background: #FFFFFF;
}
</style>