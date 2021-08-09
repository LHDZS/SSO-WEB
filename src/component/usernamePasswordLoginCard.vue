<template>
	<Card bordered class="yc-login-card">
		<div slot="title" class="yc-login-card-title">账号密码登录</div>
		<Row style="height: 306px" type="flex" justify="center" align="middle">
			<Form ref="loginInfo" :model="loginInfo" :rules="username_password_login_form_rule">
				<Row>
					<Col span="24">
						<FormItem prop="username" label="用户名">
							<Input size="large" prefix="ios-person-outline" v-model="loginInfo.username"
								   placeholder="请输入你的用户名"
								   @keyup.enter.native="login"></Input>
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem prop="password" label="密码">
							<Input size="large" prefix="ios-lock-outline" v-model="loginInfo.password" type="password"
								   placeholder="请输入你的密码"
								   @keyup.enter.native="login"></Input>
						</FormItem>
					</Col>
					<Col span="12">
						<div style="text-align: left">
							<a @click="modal=true">忘记密码？</a>
						</div>
					</Col>
					<Col span="12">
						<div style="text-align: right">
							<Checkbox v-model="remember">一周内免登录</Checkbox>
						</div>
					</Col>
					<Col span="24" style="margin-top: 15px">
						<FormItem>
							<Button size="large" type="primary" long @click="login" class="yc-button">登录</Button>
						</FormItem>
					</Col>
				</Row>
			</Form>
		</Row>
    <Row>
      <Col :span="24">
        <slot/>
      </Col>
    </Row>
		<Modal title="重设用户密码" v-model="modal" footer-hide :mask-closable="false">
			<Form ref="resetPasswordForm2" :model="resetPasswordForm2" :rules="resetPasswordForm2Rule"
				  label-position="top">
				<FormItem label="用户名" prop="username">
					<Input type="text" v-model="resetPasswordForm2.username"
						   @keydown.native.enter.prevent="()=>{}"
						   @keyup.enter.native="resetPassword2Submit"></Input>
				</FormItem>
				<FormItem>
					<Button type="primary" @click="resetPassword2Submit" long class="yc-button">发送重设密码邮件</Button>
				</FormItem>
			</Form>
		</Modal>
	</Card>
</template>

<script>
import md5 from "js-md5";
import UserRedirect from '../mixins/userRedirect'
import UsernamePasswordLoginFormRule from '../mixins/usernamePasswordLoginFormRule'
import resetPasswordByEmailStep1ErrorHandler from "@/error/auth/reset-password-by-email-step1-error-handler";
import loginErrorHandlerUsernamePassword from "@/error/auth/login-error-handler-username-password";

export default {
	name: "usernamePasswordLoginCard",
	methods: {
		login() {
			let _this = this;
			this.$refs.loginInfo.validate((valid) => {
				if (valid) {
					this.$axios({
						url: _this.$server_address + '/auth/login',
						data: {
							username: _this.$data.loginInfo.username,
							password: md5(_this.$data.loginInfo.password),
              				remember:_this.$data.remember,
						},
						headers: {
							"remember-me": _this.$data.remember
						},
						method: 'post'
					}).then(() => {
						this.$Message.success('登录成功');
						this.user_redirect()
					}).catch(err => {
						loginErrorHandlerUsernamePassword(err);
					});
				} else {
					this.$Message.error('请检查表单各项输入是否正确');
				}
			})
		},
		resetPassword2Submit() {
			let _this = this;
			this.$refs.resetPasswordForm2.validate((valid) => {
				if (valid) {
					this.$axios({
						url: _this.$server_address + '/auth/resetPasswordByEmailStep1',
						data: _this.$data.resetPasswordForm2.username,
						method: 'post'
					}).then(() => {
						this.$data.resetPasswordForm2.username = ''
						this.$data.modal = false;
						this.$Modal.success({
							title: "验证邮件已发送",
							content: "修改密码邮件已经发送到你的企业邮箱中，请点击邮件中的链接重置密码"
						});
					}).catch(err => {
						this.$data.modal = false;
						resetPasswordByEmailStep1ErrorHandler(err);
					});
				} else {
					_this.$Message.error('请检查表单各项输入是否正确');
				}
			})
		},
	},
	data() {
		return {
			loginInfo: {
				username: "",
				password: "",
			},
			remember: false,
			modal: false,
			resetPasswordForm2Rule: {
				username: [
					{required: true, message: '用户名不能为空', trigger: 'blur'},
				],
			},
			resetPasswordForm2: {
				username: ""
			},
		}
	},
	mixins: [UserRedirect, UsernamePasswordLoginFormRule]
}
</script>