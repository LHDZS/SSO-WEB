<template>
	<div>
		<Table border :data="[node.baseInfo]" :columns="columns"></Table>
		<div style="margin-top: 15px">
			<Row :gutter="15">
        <Col span="6">
          <Button type="success" ghost long @click="insertDrawer = true">新增子部门</Button>
        </Col>
        <Col span="6">
          <Button type="primary" ghost long @click="exportDepartmentExcel">下载用户部门EXCEL配置表</Button>
        </Col>
        <Col span="6">
          <Upload ref="upload" :action="uploadAction" :multiple="false" :webkitdirectory="false" class="admin-company-upload-button"
                  :with-credentials="true" :on-success="handlerUploadSuccess" :on-error="handlerUploadError" :format="['xlsx']" :max-size="3072"
                  :on-format-error="handlerFormatError" :on-exceeded-size="handlerExceededSize" :before-upload="handleBeforeUpload"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
            <Button type="warning" ghost long>上传用户部门EXCEL配置表</Button>
          </Upload>
        </Col>
			</Row>
		</div>
		<Drawer title="新建子部门" :closable="true" :mask-closable="false" v-model="insertDrawer" width="30">
			<admin-insert-department-form v-if="insertDrawer" ref="insertForm" :init-data="insertFormInitData"/>
			<div>
				<Button type="primary" ghost long @click="insertDepartment">新建</Button>
				<div style="text-align: center;margin-top: 15px">部门一旦新建将无法删除，请谨慎操作</div>
			</div>
		</Drawer>
    <Modal v-model="errorModal" :width="80" title="您需要处理excel中以下错误内容" footer-hide>
      <upload-error-list-table :data="errorList"/>
    </Modal>
	</div>
</template>

<script>
import AdminInsertDepartmentForm from '@/component/admin/adminInsertDepartmentForm'
import UploadErrorListTable from '@/component/uploadErrorListTable'
import insertDepartmentErrorHandler from "@/error/user/insert-department-error-handler";
import commonData from "@/config/common-data";
import defaultErrorHandler from "@/error/common/default-error-handler";
import innerErrorHandler from "@/error/common/inner-error-handler";

export default {
name: "adminCompanyDetail",
	props:{
		node:{
			type:Object,
			required:true,
		}
	},
	data(){
		return{
			insertDrawer:false,
			insertFormInitData: {
				id: null,
				companyId: 1,
				name: '',
				number: '',
				root: true,
				hrBpId: null,
				leaderId: null,
				parentId: null,
			},
			columns:[
				{
					title:'公司名称',
					key:'name',
				},
				{
					title: '统一社会信用代码',
					key:'code'
				},
			],
      errorModal:false,
      errorList:[],
      backups:false,
		}
	},
  computed:{
    uploadAction(){
      return this.$server_address + '/file/refreshDepartmentList/1'
    }
  },
	methods:{
    exportDepartmentExcel() {
      this.$data.backups = true;
      window.open(this.$server_address + '/file/exportDepartmentList/1')
    },
    handlerUploadSuccess(){
      this.$Message.success("导入成功")
      this.$emit('on-refresh-department')
      this.$refs.upload.clearFiles();
    },
    handlerUploadError(e,data){
      switch (e.status){
        case 500:
          innerErrorHandler();
          break;
        case 406:
          this.$data.errorList = data;
          this.$data.errorModal = true;
          this.$refs.upload.clearFiles();
          break;
        default:
          defaultErrorHandler(e)
          break;
      }
    },
    handlerFormatError(){
      commonData.system_alert_modal.open({
        title:'文件类型不合法',
        content: "仅支持xlsx",
      });
    },
    handlerExceededSize(){
      commonData.system_alert_modal.open({
        title:'文件大小超限',
        content: "文件大小最大为3072KB",
      });
    },
    handleBeforeUpload(){
      if(!this.$data.backups){
        commonData.system_alert_modal.open({
          title:'请先下载文件配置进行备份',
          content: "点击【下载用户部门EXCEL配置表】进行配置备份",
        });
      }
      return this.$data.backups;
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
						this.$emit('on-insert-department')
					}).catch(err => {
						insertDepartmentErrorHandler(err)
					})
				}
			})
		},
	},
	components:{
		AdminInsertDepartmentForm,UploadErrorListTable
	}
}
</script>

<style scoped>
.admin-company-upload-button{
  width: 100%;
}

.admin-company-upload-button >>> .ivu-upload,.admin-company-upload-button >>> .ivu-upload-select{
  width: 100%;
}
</style>