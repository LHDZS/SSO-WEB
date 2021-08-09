<template>
	<common class="login" style="height: 100%;overflow: hidden">
		<Row type="flex" justify="center" align="top" style="height: 100%;">
			<Col span="8">
				<Card bordered class="yc-login-card">
					<h1 style="margin-bottom: 25px">重设密码</h1>
					<Form ref="resetPasswordForm2" :model="resetPasswordForm2" :rules="resetPasswordForm2_rule">
						<Row>
							<Col span="24">
								<FormItem label="用户名">
									<Input size="large" prefix="ios-person-outline" disabled
										   v-model="resetPasswordForm2.username" placeholder="正在验证"></Input>
								</FormItem>
							</Col>
							<Col span="24">
								<FormItem prop="newPassword" label="新密码">
									<Input size="large" prefix="ios-lock-outline" v-model="resetPasswordForm2.newPassword"
										   type="password"
										   placeholder="新密码"></Input>
								</FormItem>
							</Col>
							<Col span="24">
								<FormItem prop="confirmPassword" label="确认密码">
									<Input size="large" prefix="ios-lock-outline"
										   v-model="resetPasswordForm2.confirmPassword" type="password"
										   placeholder="确认密码"></Input>
								</FormItem>
							</Col>
							<Col span="24" style="margin-top: 15px">
								<FormItem>
									<Button size="large" type="primary" long @click="submit" class="yc-button">重设密码</Button>
								</FormItem>
							</Col>
						</Row>
					</Form>
				</Card>
			</Col>
		</Row>
	</common>
</template>

<script>
import md5 from "js-md5";
import Common from '../component/common'
import redirectToIndex from "@/error/common/redirect-to-index";
import checkResetPasswordEmailTokenValidErrorHandler
	from "@/error/auth/check-reset-password-email-token-valid-error-handler";
import emailTokenErrorHandler from "@/error/common/email-token-error-handler";
import resetPasswordByEmailStep2ErrorHandler from "@/error/auth/reset-password-by-email-step2-error-handler";

export default {
	name: "resetPassword",
	data() {
		return {
			resetPasswordForm2: {
				username: "",
				newPassword: "",
				confirmPassword: "",
				token: ""
			},
			resetPasswordForm2_rule: {
				newPassword: [
					{required: true, message: '新密码不能为空', trigger: 'blur'},
          {pattern: '^\\S{6,16}$', message: '密码为6-16位任意字符组合', trigger: 'blur'}
				],
				confirmPassword: [
					{required: true, message: '请确认新密码', trigger: 'blur'},
          {pattern: '^\\S{6,16}$', message: '密码为6-16位任意字符组合', trigger: 'blur'},
					{
						trigger: 'blur', validator: (rule, value, callback) => {
							if (value !== this.resetPasswordForm2.newPassword) {
								callback(new Error('两次密码输入不一致'));
							} else {
								callback();
							}
						}
					}
				],
			},
		}
	},
	methods: {
		submit() {
			let _this = this;
			this.$refs.resetPasswordForm2.validate((valid) => {
				if (valid) {
					_this.$axios({
						url: _this.$server_address + '/auth/resetPasswordByEmailStep2',
						data: {
							newPassword: md5(_this.$data.resetPasswordForm2.newPassword),
							token: _this.$data.resetPasswordForm2.token
						},
						method: 'post'
					}).then(() => {
						this.$Message.success('修改密码成功，请重新登录');
						redirectToIndex(this);
					}).catch(err => {
						resetPasswordByEmailStep2ErrorHandler(err);
					});
				} else {
					this.$Message.error('请检查表单各项输入是否正确');
				}
			})
		},
		tokenStatus() {
			this.$data.resetPasswordForm2.token = this.$route.query.token;
			if (!this.$data.resetPasswordForm2.token) {
				emailTokenErrorHandler(this);
				return;
			}
			let _this = this;
			_this.$axios({
				url: _this.$server_address + '/auth/checkResetPasswordEmailTokenValid',
				method: 'post',
				data: _this.$data.resetPasswordForm2.token
			}).then(res => {
				this.$data.resetPasswordForm2.username = res.data
			}).catch(err => {
				checkResetPasswordEmailTokenValidErrorHandler(err);
			})
		}
	},
	mounted() {
		this.tokenStatus();
	},
	components:{
		Common
	}
}
</script>