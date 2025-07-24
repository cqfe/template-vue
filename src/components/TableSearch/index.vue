<template>
  <div class="page-search search-container">
    <div :class="['field-container', 'search-container__left']">
      <template v-for="item in props.fields" :key="item.name">
        <component
          :is="item.component || cmpMap[item.type]"
          v-if="!isRenderItem(item)"
          v-model:value="value[item.name]"
          :class="item.type"
          allow-clear
          v-bind="item"
          @select="item.select"
          @search="item.search"
          @change="(...vals) => onChange(item.change, vals)"
        ></component>
        <slot v-else name="renderItem" :item="item"></slot>
      </template>
      <a-space v-if="fields?.length > 1">
        <a-button @click="emit('reset')">重置</a-button>
        <a-button type="primary" @click="emit('search')">查询</a-button>
      </a-space>
    </div>
    <slot name="handle"></slot>
  </div>
</template>

<script setup>
import { Input, Select, TreeSelect, DatePicker, RangePicker, InputNumber } from 'ant-design-vue'
import { useSlots, ref, onMounted } from 'vue'

const props = defineProps({
  // 搜索字段
  fields: {
    type: Array,
    default: () => [],
  },
  // 默认展示多少列
  column: {
    type: [Number, String],
  },
  // 默认展开
  defaultExpand: {
    type: Boolean,
    default: false,
  },
})
const searchColumn = ref(4)
// const expand = ref(props.defaultExpand || false)
const slots = useSlots()
const emit = defineEmits(['reset', 'search'])
// 双向绑定值
const value = defineModel('value', {
  type: Object,
  default: () => ({}),
})
// 可用的动态组件
const cmpMap = {
  input: Input,
  select: Select,
  treeSelect: TreeSelect,
  datePicker: DatePicker,
  rangePicker: RangePicker,
  inputNumber: InputNumber,
}

function onChange(fn, vals) {
  fn?.apply(null, vals)
  if (props.fields.length <= 1) emit('search')
}

// 判断是否是自定义渲染Item
function isRenderItem(item) {
  if (!slots.renderItem) return false
  const ret = slots.renderItem({ item })
  const isExist = !!ret.find(
    (each) =>
      Array.isArray(each.children) ||
      (each.children && each.children !== 'v-if') ||
      each?.type?.render ||
      each?.type?.setup,
  )
  return isExist
}

onMounted(() => {
  const dom = document.getElementsByClassName('field-container')?.[0]
  if (!dom) return
  searchColumn.value =
    dom.clientWidth >= 1300
      ? 5
      : dom.clientWidth >= 1000
        ? 4
        : dom.clientWidth >= 800
          ? 3
          : dom.clientWidth >= 600
            ? 2
            : 1
})
</script>

<style scoped lang="scss">
.page-search {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}
.field-container {
  display: flex;
  min-height: 35px;
  flex-grow: 1;
  margin-right: 24px;
}
.field-content {
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-row-gap: 16px;
  grid-column-gap: 16px;
  justify-self: stretch;
  align-self: stretch;
  margin-right: 16px;
}
.toggle {
  color: #697dff;
  cursor: pointer;
  height: 32px;
  line-height: 32px;
  min-width: 60px;
  display: inline-block;
}
// .field-item {
//   min-width: 200px;
//   width: 100%;
// }
.close {
  height: 32px;
  overflow: hidden;
}
:deep(.ant-picker-range) {
  min-width: 320px;
}
</style>
