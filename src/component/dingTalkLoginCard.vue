<template>
	<Card bordered class="yc-login-card">
		<div slot="title" class="yc-login-card-title">使用钉钉账号登录</div>
		<div id="login_container" style="position: relative;bottom: 20px"></div>
    <slot/>
	</Card>
</template>

<script>
export default {
	name: "dingTalkLoginCard",
	methods: {
		createDingTalkImg() {
			let _this = this;
			let url = this.$app_address + '/dingTalkAuth';
			if(_this.$route.query.callback){
			  url += "?callback="+_this.$route.query.callback;
      }
			let urlEncode = encodeURIComponent(url)
			let gotoRaw = "https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=" +
				this.$ding_app_secret + "&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=" +
          urlEncode;
			let goto = encodeURIComponent(gotoRaw);
			let obj = DDLogin({
				id: "login_container",
				goto: goto,
				style: "border:none;background-color:#FFFFFF;",
				width: "365",
				height: "300"
			});
			let handleMessage = function (event) {
				let origin = event.origin;
				if (origin === "https://login.dingtalk.com") { //判断是否来自ddLogin扫码事件。
					let loginTmpCode = event.data;
					let redirect_uri = _this.$app_address + "/dingTalkAuth";
          window.location.href = "https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=" + _this.$ding_app_secret +
              "&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=" +
              redirect_uri + "&loginTmpCode=" + loginTmpCode;
				}
			};
			if (typeof window.addEventListener != 'undefined') {
				window.addEventListener('message', handleMessage, false);
			} else if (typeof window.attachEvent != 'undefined') {
				window.attachEvent('onmessage', handleMessage);
			}
		},
	},
	mounted() {
		this.createDingTalkImg()
	},
}
</script>

<style scoped>

</style>