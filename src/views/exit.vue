<template>
	<common>
		<Row type="flex" justify="center" align="top" style="height: 100%">
			<Col span="8">
				<Card dis-hover>
					正在退出,请稍等......
				</Card>
			</Col>
		</Row>
	</common>
</template>

<script>
import Common from '../component/common'
import redirectToIndex from "@/error/common/redirect-to-index";
import commonData from "@/config/common-data";
export default {
	name: "exit",
	mounted() {
		this.exit()
	},
	methods: {
		exit() {
			let _this = this;
			_this.$axios({
				url: _this.$server_address + '/auth/exit',
				method: 'post'
			}).then(() => {
				redirectToIndex(this);
			}).catch(err => {
				commonData.system_alert_modal.open({
					title: "服务器内部错误,请联系运维人员",
					content: "exit http status " + err.response.status
				});
			})
		}
	},
	components:{
		Common
	}
}
</script>