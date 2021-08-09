<template>

</template>

<script>
import UserRedirect from './userRedirect'
import loginStatusErrorHandlerGuestPage from "@/error/auth/login-status-error-handler-guest-page";
import UserRemember from "@/mixins/userRemember";

export default {
	name: "guestPageStatusCheck",
	mixins: [UserRedirect,UserRemember],
	methods: {
		guest_status_check() {
			let _this = this;
			_this.$axios({
				url: _this.$server_address + '/user/loginStatus',
				method: 'post'
			}).then(() => {
				_this.user_redirect()
			}).catch(err => {
				loginStatusErrorHandlerGuestPage(err);
			})
		}
	},
	created() {
	  this.try_remember_login(()=>{
      this.guest_status_check();
    })
	}
}
</script>

<style scoped>

</style>