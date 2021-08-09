<template>
  <div>
    <Table :data="data" :columns="columns" border>
      <template slot-scope="{ row, index }" slot="row">
        {{ row.row + 2 }}
      </template>
      <template slot-scope="{ row, index }" slot="error">
        <div v-for="(item,index) in row.errorList" :key="index">{{ item }}</div>
      </template>
    </Table>
  </div>
</template>

<script>
export default {
  name: "uploadErrorListTable",
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      columns: [
        {
          title: 'Excel行',
          slot: 'row',
        },
        {
          title: '错误信息',
          slot: 'error',
        },
      ]
    }
  }
}
</script>

<style scoped>

</style>