<template>
	<Modal v-model="visible" :closable="false" :mask-closable="false" class="okr-alert-modal-transfer">
		<div slot="header" class="okr-alert-modal">
			<Icon type="md-help"/>
			<span class="okr-alert-modal-title">{{ title }}</span>
		</div>
		<div>{{ content }}</div>
		<div slot="footer">
			<Button type="default" @click="cancel">取消</Button>
			<Button type="primary" style="background-color: rgb(56, 159, 238)" @click="ok">确定</Button>
		</div>
	</Modal>
</template>

<script>
export default {
	name: "okrConfirmModal",
	data() {
		return {
			visible: false,
			title: "错误",
			content: '您当前没有操作权限',
			onOk: null,
			onCancel:null,
		}
	},
	methods: {
		cancel() {
			this.$data.visible = false;
			if (this.$data.onCancel) {
				this.$data.onCancel();
			}
		},
		ok() {
			this.$data.visible = false;
			if (this.$data.onOk) {
				this.$data.onOk();
			}
		},
		open(config) {
			this.$data.title = config.title;
			this.$data.content = config.content;
			this.$data.onOk = config.onOk;
			this.$data.onCancel = config.onCancel;
			this.$data.visible = false;
			this.$nextTick(() => {
				this.$data.visible = true;
			})
		}
	}
}
</script>

<style scoped>
.okr-alert-modal .ivu-icon {
	color: #ff9900 !important;
	font-size: 18px;
}

.okr-alert-modal .okr-alert-modal-title {
	font-size: 16px;
	margin-left: 15px;
}

.okr-alert-modal-transfer >>>.ivu-modal-header{
	border: none;
}

.okr-alert-modal-transfer >>>.ivu-modal-footer{
	border: none;
}
</style>