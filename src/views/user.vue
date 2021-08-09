<template>
	<div class="user-old" style="height: 100%;padding: 0;background-color: #FFFFFF">
		<div class="user-header">
			<div class="title">SSO登录系统<span></span>用户中心</div>
			<Row style="height: 100%" type="flex" align="middle" justify="center">
				<Col :xs="{span:14}" :sm="{span:10}" :md="{span:8}" :lg="{span:6}">
					<img src="../img/logo.png" width="100%"/>
				</Col>
			</Row>
			<div class="wrapR">
				<div v-if="adminValid" @click="openAdmin"><Icon type="ios-build-outline" size="24"/>管理员后台</div>
				<div @click="modal=true"><Icon type="ios-lock-outline" size="24"/>修改密码</div>
				<div @click="exit"><Icon type="ios-contact-outline" size="24"/>退出</div>
			</div>
		</div>
		<div class="user-box">
			<div class="main">
				<div class="main-L">
					<div class="header">
						<span class="title">个人资料</span>
					</div>
					<div class="content">
						<div class="img-up">
							<div class="head-portrait">
								<img v-if="userAvatar" :src="userAvatar" alt="">
								<Avatar v-else :username="user_info.user.name" backgroundColor="#2591F2" color="#fff" :initials="userName(user_info.user.name)" style="width:100%;height:100%;"></Avatar>
							</div>
							<div class="text">
								<Button @click="openImg">上传头像</Button>
							</div>
						</div>
						<ul class="co-ul">
							<li>
								<h1>{{user_info.user.username}}</h1>
							</li>
							<li>
								<img src="/icon/grzx.png" alt="">
								<span>姓名：</span>
								<span>{{user_info.user.name}}</span>
							</li>
							<li>
								<img src="/icon/yx.png" alt="">
								<span>邮箱：</span>
								<span>{{user_info.user.email}}</span>
							</li>
							<li>
								<img src="/icon/zw.png" alt="">
								<span>职位：</span>
								<span>{{user_info.user.userStaff || '暂无'}}</span>
							</li>
							<li class="li">
								<img src="/icon/bm.png" alt="">
								<span>部门：</span>
								<div class="lists">
									<div class="list" v-for="(item,key) in user_info.departments" :key="key">
										<Tooltip :content="item" max-width="400" placement="bottom">
											{{item}}
										</Tooltip>
									</div>
								</div>
							</li>
							<!-- <li>
								<img src="/icon/dj.png" alt="">
								<span>职级：</span>
								<span>待定</span>
							</li> -->
						</ul>
						<div class="clear"></div>
					</div>
				</div>
				<div class="main-R">
					<div class="list">
						<div class="li" @click="path($app_okr_address)">
							<div class="con">
								<img src="/icon/mb.png" alt="">
								<div>目标</div>
							</div>
						</div>
						<div class="li" @click="path($app_pes_address)">
							<div class="con">
								<img src="/icon/kh.png" alt="">
								<div>考核</div>
							</div>
						</div>
						<div class="li" @click="path($app_epc_address)">
							<div class="con">
								<img src="/icon/wh.png" alt="">
								<div>文化</div>
							</div>
						</div>
						<div class="li" @click="path($app_talk_address)">
							<div class="con">
								<div class="dhImg">
									<img src="/icon/dh.png" alt="">
								</div>
								<div>面谈</div>
							</div>
						</div>
						<div class="li" @click="path($app_wiki_address)">
							<div class="con">
								<img src="/icon/wiki.png" alt="">
								<div>WIKI</div>
							</div>
						</div>
						<div class="li" @click="path($app_jira_address)">
							<div class="con">
								<img src="/icon/jira.png" alt="">
								<div>JIRA</div>
							</div>
						</div>
						<div class="li" @click="path($app_home_address)">
							<div class="con">
								<img src="/icon/zy.png" alt="">
								<div>内网</div>
							</div>
						</div>
						<div class="clear"></div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
			<Modal title="修改用户密码" v-model="modal" footer-hide>
				<reset-password-by-old-password-form/>
			</Modal>
		</div>
		<imgTailor ref="tailor"></imgTailor>
	</div>
</template>

<script>
import UserPageStatusCheck from '../mixins/userPageStatusCheck'
import ResetPasswordByOldPasswordForm from "@/component/resetPasswordByOldPasswordForm";
import imgTailor from "@/component/img-tailor";
import getTokenErrorHandler from "@/error/user/get-token-error-handler";
import redirectToAdmin from "@/error/common/redirect-to-admin";
import redirectToExit from "@/error/common/redirect-to-exit";
import Avatar from 'vue-avatar'

export default {
	name: "user",
	components: {ResetPasswordByOldPasswordForm,Avatar,imgTailor},
	data() {
		return {
			userAvatar: null,
			modal: false,
		}
	},
	computed: {
		adminValid() {
			for (let i = 0; i < this.$data.user_info.authorities.length; i++) {
				let item = this.$data.user_info.authorities[i];
				if (item.authority === 'SSO-SUPER-ADMIN' || item.authority === 'SSO-ADMIN') {
					return true;
				}
			}
			return false;
		}
	},
	methods: {
		userImg() {
			this.$axios({
				url: this.$server_address + '/file/downloadAvatar?size=' + 200,
				method: 'get'
			}).then(res => {
				this.userAvatar = this.$server_address + '/file/downloadAvatar?size=' + 200;
			})
		},
		openImg() {
			this.$refs.tailor.dialogVisible = true;
		},
		userName(name) {
			if (name.length < 3) {
				return name
			}else if (name.length >= 3) {
				return name.substring(name.length-2)
			}
		},
		path (url) {
			window.open(url)
		},
		openAdmin() {
			redirectToAdmin();
		},
		openApp(callback) {
			let _this = this;
			this.$axios({
				url: _this.$server_address + '/user/getToken',
				method: 'post'
			}).then(res => {
				window.open(callback + "?token=" + res.data);
			}).catch(err => {
				getTokenErrorHandler(err)
			});
		},
		exit() {
			redirectToExit(this);
		},
	},
  created() {
	if(this.$route.query.modify_password==='1'){
	    this.$data.modal = true;
	}
	this.userImg()
  },
  mixins: [UserPageStatusCheck]
}
</script>

<style scoped lang="less">
.yc-card {
	height: 150px;
	line-height: 125px;
	background-color: #2b85e4;
	color: #fff;
	text-align: center;
	font-size: 25px;
	cursor: pointer;
	border: none;
}

.yc-toolbar span {
	color: #fff;
	margin-right: 15px;
}

.ivu-btn:hover {
	background-color: white;
}

.user-header {
	height: 30%;
	overflow-y: hidden;
	background: url('/icon/banner.png') no-repeat;
	background-size: 100% 100%;
	position: relative;
	.title {
		position: absolute;
		color: #fff;
		padding: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
		span {
			width: 2px;
			height: 20px;
			background-color: #fff;
			margin: 0 8px;
		}
	}
	.wrapR {
		position: absolute;
		right: 0;
		top: 0;
		color: #fff;
		padding: 20px;
		display: flex;
		div {
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 0 8px;
			cursor: pointer;
			i {
				margin-right: 5px;
			}
		}
	}
}
.user-box {
	width: 70%;
	min-width: 1145px;
	padding-top: 25px;
	margin: 0 auto;
	box-sizing: border-box;
	height: 70%;
	background-color: #FFFFFF;
	.header {
		height: 70px;
		.title {
			font-size: 24px;
			padding: 10px 0px;
			border-bottom: 2px solid #006FC9;
		}
	}
	.main {
		width: 100%;
		.main-L {
			width: 70%;
			// min-width: 770px;
			box-sizing: border-box;
			float: left;
			.content {
				width: 100%;
				border-right: 1px solid #bbb;
				// @media screen and (max-width: 1540px) {
				// 	.img-up {
				// 		width: 100%;
				// 		.head-portrait {
				// 			margin: 0 auto;
				// 		}
				// 	}
				// }
				.img-up {
					float: left;
					margin-top: 10px;
					.head-portrait {
						width: 150px;
						height: 150px;
						border-radius: 50%;
						// border: 1px solid #006FC9;
						display: flex;
						justify-content: center;
						align-items: center;
						overflow: hidden;
						img {
							width: 100%;
							height: 100%;
						}
					}
					.text {
						width: 100%;
						font-size: 16px;
						text-align: center;
						margin-top: 23px;
						color: #006FC9;
						cursor: pointer;
					}
				}
				.co-ul {
					float: left;
					margin-left: 53px;
					li {
						list-style-type: none;
						color: #101010;
						margin-bottom: 25px;
						display: flex;
						align-items: center;
						img {
							width: 30px;
							height: 30px;
						}
						span {
							color: rgba(16, 16, 16, 100);
							font-size: 20px;
							text-align: left;
							font-family: SourceHanSansSC-regular;
							margin-left: 38px;
						}
						.lists {
							display: flex;
							flex-flow: column;
							align-items: none;
							margin-left: 38px;
							.list {
								max-width: 415px;
								color: rgba(16, 16, 16, 100);
								font-size: 20px;
								text-align: left;
								font-family: SourceHanSansSC-regular;
								margin-bottom: 15px;
								overflow: hidden;
								text-overflow:ellipsis;
								white-space: nowrap;
							}
						}
					}
					.li {
						align-items: start;
						align-items: flex-start;
					}
				}
			}
		}
		.main-R {
			width: 30%;
			float: left;
			// @media screen and (max-width: 1540px) {
			// 	.list {
			// 		padding-top: 160px !important;
			// 		.li {
			// 			height: 150px !important;
			// 		}
			// 	}
			// }
			.list {
				width: 100%;
				padding-top: 70px;
				.li {
					width: 50%;
					height: 120px;
					float: left;
					text-align: right;
					padding-top: 10px;
					box-sizing: border-box;
					cursor: pointer;
					.con {
						display: inline-block;
						width: 67px;
						text-align: center;
						div {
							color: #2AB3FA;
							font-size: 20px;
							font-family: SourceHanSansSC-regular;
						}
					}
					.dhImg {
						width: 67px;
						height: 68px;
						background-color: #7ED0F6;
						border-radius: 50%;
						display: flex;
						justify-content: center;
						align-items: center;
						img {
							width: 80%;
						}
					}
				}
			}
		}
	}
	
}
.clear {
	clear: both;
}
</style>

<style lang="less">
.user-old .vue-avatar--wrapper span {
	font-size: 38px;
}
.user-old .ivu-tooltip-rel {
	max-width: 415px;
	overflow: hidden;
	text-overflow:ellipsis;
	white-space: nowrap;
}
</style>