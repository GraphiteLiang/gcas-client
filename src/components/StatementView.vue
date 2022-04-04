<script lang="ts">
import { ref } from "vue";
import { ElMessage } from 'element-plus'

const input_username = ref("element-plus");
const input_password = ref("element-plus")


const login = () => {
  ElMessage.success(input_username.value + input_password.value)
}
</script>

<template>
  <p>
    这里是展示界面
  </p>
</template>

<style>
.el-button {
  margin: 4px;
}
</style>
