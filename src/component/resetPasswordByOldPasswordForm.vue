<template>
	<Form ref="resetPasswordForm1" :model="resetPasswordForm1" :rules="resetPasswordForm1Rule">
		<FormItem label="原密码：" prop="oldPassword">
			<Input type="password" v-model="resetPasswordForm1.oldPassword"></Input>
		</FormItem>
		<FormItem label="新密码：" prop="newPassword">
			<Input type="password" v-model="resetPasswordForm1.newPassword"></Input>
		</FormItem>
		<FormItem label="确认密码：" prop="confirmPassword">
			<Input type="password" v-model="resetPasswordForm1.confirmPassword"></Input>
		</FormItem>
		<FormItem>
			<Button type="primary" @click="resetPassword1Submit" long class="yc-button">修改密码</Button>
		</FormItem>
	</Form>
</template>

<script>
import md5 from "js-md5";
import restPasswordByOldPasswordErrorHandler from "@/error/user/rest-password-by-old-password-error-handler";
import redirectToExit from "@/error/common/redirect-to-exit";

export default {
	name: "resetPasswordByOldPasswordForm",
	data() {
		return {
			resetPasswordForm1: {
				oldPassword: '',
				newPassword: '',
				confirmPassword: ''
			},
			resetPasswordForm1Rule: {
				oldPassword: [
					{required: true, message: '原密码不能为空', trigger: 'blur'},
				],
				newPassword: [
					{required: true, message: '新密码不能为空', trigger: 'blur'},
					{pattern: '^\\S{6,16}$', message: '密码为6-16位任意字符组合', trigger: 'blur'}, {
						trigger: 'blur', validator: (rule, value, callback) => {
							if (value === this.resetPasswordForm1.oldPassword) {
								callback(new Error('新密码和旧密码不能相同'));
							} else {
								callback();
							}
						}
					}
				],
				confirmPassword: [
					{required: true, message: '请确认新密码', trigger: 'blur'},
          {pattern: '^\\S{6,16}$', message: '密码为6-16位任意字符组合', trigger: 'blur'},
					{
						trigger: 'blur', validator: (rule, value, callback) => {
							if (value !== this.resetPasswordForm1.newPassword) {
								callback(new Error('两次密码输入不一致'));
							} else {
								callback();
							}
						}
					}
				],
			}
		}
	},
	methods: {
		resetPassword1Submit() {
			let _this = this;
			this.$refs.resetPasswordForm1.validate((valid) => {
				if (valid) {
					_this.$axios({
						url: _this.$server_address + '/user/restPasswordByOldPassword',
						data: {
							oldPassword: md5(_this.$data.resetPasswordForm1.oldPassword),
							newPassword: md5(_this.$data.resetPasswordForm1.newPassword),
						},
						method: 'post'
					}).then(() => {
						this.$Message.success('修改密码成功，请重新登录');
						redirectToExit(this);
					}).catch(err => {
						restPasswordByOldPasswordErrorHandler(err);
					});
				} else {
					this.$Message.error('请检查表单各项输入是否正确');
				}
			})
		}
	}
}
</script>

<style scoped>

</style>