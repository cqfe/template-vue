<template>
  <a-card class="pageWrapper">
    <TableSearch v-model:value="listQuery" :fields="fields" @reset="onReset" @search="fetchData">
      <template #handle>
        <a-button type="primary"> 新建 </a-button>
      </template>
    </TableSearch>
    <a-table
      row-key="id"
      :data-source="dataSource"
      :loading="loading"
      :columns="TABLE_DEMO_COLUMNS"
      :row-selection="rowSelection"
      :pagination="pagination"
      @change="onTableChange"
    >
      <template #bodyCell="{ record, column, index }">
        <template v-if="column.dataIndex === 'order'">
          {{ (pagination.current - 1) * pagination.pageSize + index + 1 }}
        </template>
        <a-flex v-if="column.dataIndex === 'operate'">
          <a-button size="small" type="link">修改</a-button>
          <a-popconfirm title="确定删除吗？" @confirm="onDel(record.id)">
            <a-button size="small" type="link" danger>删除</a-button>
          </a-popconfirm>
        </a-flex>
      </template>
    </a-table>
  </a-card>
</template>

<script setup>
import { message } from 'ant-design-vue'
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { deletePetPetId } from '@/api/demoApi.js'
import { DEMO_TYPE_OPTIONS } from '@/constants/options.js'
import TableSearch from '@/components/TableSearch/index.vue'
import { usePaginationReq } from '@/hooks/usePaginationReq'
import { TABLE_DEMO_COLUMNS } from '@/constants/columns'

defineOptions({ name: 'DemoList' })

// table相关数据和方法,>>>>替换模拟响应为列表请求函数
const { dataSource, loading, pagination, fetchList, resetPage, changePage } = usePaginationReq(async () => ({
  data: {
    total: 10,
    current: 1,
    records: [{ id: 1 }],
  },
}))
// table查询表单值
const listQuery = reactive({
  demoName: '',
  demoType: undefined,
})
// 选中数据key
const selectedRowKeys = ref([])
// 选中数据
const rowSelection = computed(() => {
  return {
    selectedRowKeys: selectedRowKeys.value,
    onChange: (rowKeys) => {
      selectedRowKeys.value = rowKeys
    },
  }
})
// table查询表单配置
const fields = computed(() => [
  { name: 'demoName', type: 'input', placeholder: '请输入名称' },
  { name: 'demoType', type: 'select', placeholder: '请选择类型', options: DEMO_TYPE_OPTIONS },
])
function fetchData(isRefresh) {
  console.debug('fetchData Query:', listQuery)
  if (isRefresh) pagination.current = 1
  fetchList(listQuery)
}
// table搜索
function onSearch() {
  resetPage()
  nextTick(() => {
    fetchData(true)
  })
}
// 重置查询
function onReset() {
  Object.keys(listQuery).forEach((key) => {
    listQuery[key] = undefined
  })
  onSearch()
}
// 表单查询条件改变
function onTableChange(page) {
  if (page.current) changePage(page, false)
  nextTick(() => {
    fetchData()
  })
}
// 删除数据
function onDel(id) {
  deletePetPetId(id ? [id] : selectedRowKeys.value).then(() => {
    message.success('删除成功')
    fetchData(true)
  })
}
// 初始化请求列表
onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss"></style>
