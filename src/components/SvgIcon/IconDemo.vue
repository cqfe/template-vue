<script setup>
import Icon from '@ant-design/icons-vue'

defineOptions({ name: 'IconRoom' })
</script>

<template>
  <Icon>
    <template #component="svgProps">
      <svg
        v-bind="svgProps"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="16"
        height="16"
        fill="currentColor"
      >
        <path
          d="M136.756828 105.885079L553.373565 1.161746a36.425507 36.425507 0 0 1 45.531883 36.425507v949.339777a36.425507 36.425507 0 0 1-43.255289 36.425507L139.033422 945.948334A59.191449 59.191449 0 0 1 91.224944 889.033479V162.799933a59.191449 59.191449 0 0 1 45.531884-56.914854zM696.798998 934.565363H865.266968a66.021231 66.021231 0 0 0 66.021232-66.021231V153.693557A66.021231 66.021231 0 0 0 865.266968 87.672325h-168.46797zM448.650232 433.714642c-25.042536 0-47.808478 34.148913-47.808478 77.404202s20.489348 77.404202 47.808478 77.404203 47.808478-34.148913 47.808478-77.404203-22.765942-77.404202-47.808478-77.404202z"
        ></path>
      </svg>
    </template>
  </Icon>
</template>
<style scoped lang="less"></style>
