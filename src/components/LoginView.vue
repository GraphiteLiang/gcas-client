<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from 'element-plus';
import axios from 'axios';
import md5 from 'js-md5';
import {useRouter} from 'vue-router'
import { useStore } from "vuex";
const store = useStore()
defineProps<{ msg: string }>();
console.log("store=" + store)
const count = ref(0);
const input_username = ref("graphite");
const input_password = ref("123456")
const router = useRouter()
const login = () => {
  const password = md5(input_password.value) 
  const userName = input_username.value
  axios.post('http://127.0.0.1:8080/api/gcas/login',
    {
      userName:userName,
      password:password
    }
  ).then(
    (response) => {
      console.log(response.data)
      const token = response.data.Token
      store.commit("userName", userName)
      store.commit("token", token)
      ElMessage.info("登陆成功！")
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
