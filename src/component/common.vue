<style scoped>
@import '../styles/common.css';
</style>
<template>
	<div class="app">
		<div class="yc-header">
			<Row type="flex" justify="center" align="middle" style="height: 100%">
				<Col span="6">
					<img src="../img/logo.png" width="100%">
				</Col>
			</Row>
		</div>
		<div class="yc-content">
			<slot></slot>
		</div>
	</div>
</template>
<script>
export default {}
</script>
<style>
.app {
	width: 100%;
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	text-align: center;
}
</style>
