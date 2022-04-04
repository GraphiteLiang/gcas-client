<script setup lang="ts">
import { getCurrentInstance, ref } from "vue";
import { ElMessage } from 'element-plus';
import axios from 'axios';
import md5 from 'js-md5';
import {useRouter} from 'vue-router'

defineProps<{ msg: string }>();

const count = ref(0);
const input_username = ref("graphite");
const input_password = ref("123456")
const login = () => {
  const password = md5(input_password.value) 
  
  axios.post('http://127.0.0.1:8080/api/gcas/login',
    {
      userName:input_username.value,
      password:password
    }
  ).then(
    (response) => {
      console.log(response.data)
      ElMessage.info("登陆成功！")
      let router = useRouter()
      router.push("/StatementView")
      console.log(router)
    }
  ).catch(
    (error) => {
      console.log(error)
    }
  )
}
</script>

<template>
  <h1>{{ msg }}</h1>

  <p>
    欢迎使用Graphite的合租资产管理系统
  </p>

  <!-- example components -->
  <!-- <el-button type="primary" @click="count++">count is: {{ count }}</el-button>
  <el-button type="success" @click="count++">count is: {{ count }}</el-button>
  <el-button type="warning" @click="count++">count is: {{ count }}</el-button>
  <el-button type="danger" @click="count++">count is: {{ count }}</el-button>
  <el-button type="info" @click="count++">count is: {{ count }}</el-button> -->
  <br />
  <el-input v-model="input_username" style="width: 200px; margin: 20px" />
  <el-tag>用户名</el-tag>
  <el-input v-model="input_password" style="width: 200px; margin: 20px" />
  <el-tag>密码</el-tag>
  <br />
  <el-button @click="login">登录</el-button>
</template>

<style>
.el-button {
  margin: 4px;
}
</style>
