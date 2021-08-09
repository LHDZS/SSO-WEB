<template>
	<common class="login" style="height: 100%;overflow: hidden">
		<Row style="height: 100%" type="flex" align="center" justify="top">
			<Col span="8">
				<Card dis-hover>
					<div style="font-size: 18px" slot="title">提示</div>
					<div style="font-size: 16px">您登录的账号暂时没有权限进入<b>{{ system_name }}</b>，请联系管理员</div>
					<div style="margin-top: 15px">
						<Button size="large" type="primary" long class="yc-button" @click="back">返回用户中心</Button>
					</div>
				</Card>
			</Col>
		</Row>
	</common>
</template>

<script>
import Common from '../component/common'
import redirectToIndex from "@/error/common/redirect-to-index";

export default {
	name: "error",
	data() {
		return {
			system_name: '(     )',
		}
	},
	methods:{
		back(){
			redirectToIndex(this);
		}
	},
	mounted() {
		let query = this.$route.query.system;
		switch (query) {
			case 'pes':
				this.$data.system_name = '业务考核系统';
				break;
			case 'epc':
				this.$data.system_name = '文化评价系统';
				break;
			case 'jira':
				this.$data.system_name = 'JIRA系统';
				break;
			case 'okr':
				this.$data.system_name = 'OKR系统';
				break;
			case 'wiki':
				this.$data.system_name = 'WIKI系统';
				break;
		}
	},
	components: {
		Common
	}
}
</script>

<style scoped>

</style>