<template>

</template>

<script>

import getTokenErrorHandler from "@/error/user/get-token-error-handler";
import redirectToUser from "@/error/common/redirect-to-user";

export default {
	name: "userRedirect",
	methods: {
		user_redirect() {
			let _this = this;
			let callback = _this.$route.query.callback
			if (new RegExp('(http|https)://\\S+').test(callback)) {
				_this.$axios({
					url: _this.$server_address + '/user/getToken',
					method: 'post'
				}).then(res => {
					_this.$data.token = res.data
					if (callback.indexOf("?") !== -1) {
						window.location.replace(callback + "&token=" + res.data);
					} else {
						window.location.replace(callback + "?token=" + res.data);
					}
				}).catch(err => {
					getTokenErrorHandler(err);
				});
			} else if (_this.$route.path !== '/user') {
				redirectToUser(this);
			}
		}
	}
}
</script>

<style scoped>

</style>