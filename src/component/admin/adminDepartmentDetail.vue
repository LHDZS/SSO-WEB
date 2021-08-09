<template>
	<div>
		<Table border :data="[node.baseInfo]" :columns="columns">
			<template slot-scope="{ row, index }" slot="leaderName">
				{{ userInfo(row.leaderId) }}
			</template>
			<template slot-scope="{ row, index }" slot="hrBpName">
				{{ userInfo(row.hrBpId) }}
			</template>
		</Table>
		<div style="margin-top: 15px">
			<Row :gutter="15">
				<Col span="6">
					<Button type="primary" ghost long @click="openUpdateDrawer">编辑</Button>
				</Col>
        <Col span="6">
          <Button type="success" ghost long @click="openInsertDrawer">新增子部门</Button>
        </Col>
        <Col span="6">
          <Button type="error" ghost long @click="openDeleteModal">删除部门</Button>
        </Col>
			</Row>
		</div>
		<Drawer title="新建子部门" :closable="true" :mask-closable="false" v-model="insertDrawer" width="30">
			<admin-insert-department-form v-if="insertDrawer" ref="insertForm" :init-data="insertFormInitData"/>
			<div>
				<Button type="primary" ghost long @click="insertDepartment">新建</Button>
			</div>
		</Drawer>
		<Drawer title="编辑部门" :closable="true" :mask-closable="false" v-model="updateDrawer" width="30">
			<admin-insert-department-form v-if="updateDrawer" ref="updateForm" :init-data="updateFormInitData"/>
			<div>
				<Button type="primary" ghost long @click="updateDepartment">更新部门信息</Button>
			</div>
		</Drawer>
	</div>
</template>

<script>
import AdminInsertDepartmentForm from '@/component/admin/adminInsertDepartmentForm'
import insertDepartmentErrorHandler from "@/error/user/insert-department-error-handler";
import commonData from "@/config/common-data";
import selectSSOUserByIdListLocal from "@/config/sso-user-local";

export default {
	name: "adminDepartmentDetail",
	props: {
		node: {
			type: Object,
			required: true,
		}
	},
	computed: {
		userInfo() {
			return (userId) => {
				if (userId && commonData.sso_user_local_map[userId]) {
					let data = commonData.sso_user_local_map[userId];
					return data.user.name + ' (' + data.user.username + ')';
				}
				return null
			}
		},
	},
	data() {
		return {
			commonData,
			updateFormInitData: null,
			insertFormInitData: {
				id: null,
				companyId: null,
				name: '',
				root: false,
				hrBpId: null,
				leaderId: null,
				parentId: this.$props.node.baseInfo.id
			},
			insertDrawer: false,
			updateDrawer: false,
			columns: [
				{
					title: '部门名称',
					key: 'name',
				},
				{
					title: 'LEADER',
					slot: 'leaderName'
				},
				{
					title: 'HRBP',
					slot: 'hrBpName'
				},
			]
		}
	},
	methods: {
    openDeleteModal(){
      commonData.system_confirm_modal.open({
        title: '确认要删除部门吗？',
        content: '部门的所有子部门和对应的用户部门关系都会被删除',
        onOk:()=>{
          this.$axios({
            url: this.$server_address + '/user/removeDepartment/'+this.$props.node.baseInfo.id,
            method: 'post',
            'hide-spin': true
          }).then(res => {
            this.$Message.success('删除部门成功')
            this.$emit('on-remove-department')
          }).catch(err => {
            insertDepartmentErrorHandler(err)
          })
        }
      })
    },
		insertDepartment() {
			this.$refs.insertForm.$refs.departmentForm.validate(valid => {
				if (valid) {
					this.$axios({
						url: this.$server_address + '/user/insertDepartment',
						method: 'post',
						data: this.$refs.insertForm.convertOut(),
						'hide-spin': true
					}).then(res => {
						this.$data.insertDrawer = false;
						this.$Message.success('创建部门成功')
						this.$emit('on-insert-department',res.data)
					}).catch(err => {
						insertDepartmentErrorHandler(err)
					})
				}
			})
		},
		updateDepartment() {
			this.$refs.updateForm.$refs.departmentForm.validate(valid => {
				if (valid) {
					this.$axios({
						url: this.$server_address + '/user/updateDepartment',
						method: 'post',
						data: this.$refs.updateForm.convertOut(),
						'hide-spin': true
					}).then(() => {
						this.$data.updateDrawer = false;
						this.$Message.success('更新部门信息成功')
						this.$emit('on-update-department')
					}).catch(err => {
						insertDepartmentErrorHandler(err)
					})
				}
			})
		},
		openInsertDrawer() {
			this.$data.insertFormInitData.parentId = this.$props.node.baseInfo.id;
			this.$data.insertDrawer = true;
		},
		openUpdateDrawer() {
			this.$data.updateFormInitData = JSON.parse(JSON.stringify(this.$props.node.baseInfo));
			this.$data.updateDrawer = true;
		}
	},
	watch: {
		node() {
			selectSSOUserByIdListLocal([this.$props.node.baseInfo.leaderId, this.$props.node.baseInfo.hrBpId])
		}
	},
	created() {
		selectSSOUserByIdListLocal([this.$props.node.baseInfo.leaderId, this.$props.node.baseInfo.hrBpId])
	},
	components: {
		AdminInsertDepartmentForm
	}
}
</script>

<style scoped>

</style>