<template>
	<div style="width:100%;height: 100%">
		<router-view></router-view>
		<okr-alert-modal ref="alertModal"/>
		<okr-confirm-modal ref="confirmModal"/>
	</div>
</template>
<script>
import OkrAlertModal from "@/component/modal/okrAlertModal";
import OkrConfirmModal from "@/component/modal/okrConfirmModal";
import commonData from "@/config/common-data";
export default {
	components:{
		OkrAlertModal,OkrConfirmModal
	},
	mounted() {
		commonData.system_alert_modal = this.$refs['alertModal'];
		commonData.system_confirm_modal = this.$refs['confirmModal'];
	},
}
</script>
