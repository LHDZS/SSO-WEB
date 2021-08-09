
<template>
  <div class="bottom-pag">
    <Page :total="total" :current="current" :page-size="pageSize" size="small" show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"/>
  </div>
</template>

<script>
export default {
  name: 'pagination',
  data() {
    return {
        currentPage: 1
    }
  },
  props: {
    total: Number,
    pageSize: Number,
    current: Number
  },
  methods: {
    pageChange(val) {
      this.$emit('pageChange',val)
    },
    pageSizeChange(val) {
      this.$emit('pageSizeChange',val)
    }
  }
}
</script>

<style lang="less" scoped>
.bottom-pag {
    width: 100%;
    margin-top: 20px;
    text-align: right;
}
</style>
