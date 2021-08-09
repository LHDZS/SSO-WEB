<script>
export default {
	name: "usernamePasswordLoginFormRule",
	data() {
		return {
			username_password_login_form_rule: {
				username: [
					{required: true, message: '用户名不能为空', trigger: 'blur'},
				],
				password: [
					{required: true, message: '密码不能为空', trigger: 'blur'},
          {pattern: '^\\S{6,16}$', message: '密码为6-16位任意字符组合', trigger: 'blur'},
				]
			},
		}
	}
}
</script>