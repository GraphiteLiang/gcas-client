<script setup lang="ts">
import {reactive, onMounted, ref} from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios';
import { useStore } from "vuex";
import { table } from 'console';
const store = useStore()
const form = reactive({
  cashOut: '',
  remark: '',
  aaPeople: '',
})

const aaPeoples = ref([{userName:"test1",userNickName:"test1nick"}])
const aaPeopleSelected = ref([])
let dialogPayVisiable = ref(false)
let dialogFormVisible = ref(false)
let url = ref("logo.png")
let tableData = ref([{
  db_qid : "111",
  payer_name : "test",
  payer_nick_name : "test",
  receiver_nick_name : "test",
  cash : "test",
  remark : "test",
  receiver_name : "test",
  }
])  
let getTableData = () => {
  let tmpData = []
  axios({
    url : 'http://127.0.0.1:8080/api/gcas/allcreditrelated',
    method : 'get',
    headers: {
        'Content-Type': 'application/json'
    },
    params:{
        userName: store.state.userName,
        token: store.state.token
    }
  }).then(
    (response) => {
      tableData.value.splice(0, tableData.value.length)
      const items = response.data.CreditPayableItems
      for (let i=0; i<items.length;i++) {
        let payer_nick_name = response.data.UserNickName
        let receiver_nick_name = items[i].UserNickName
        let receiver_name = items[i].UserName
        let payer_name = response.data.UserName
        if (items[i].ItemType == 2) {
          payer_nick_name = items[i].UserNickName
          receiver_nick_name = response.data.UserNickName
          receiver_name = response.data.UserName
          payer_name = items[i].UserName
        }
        tableData.value.push({
          db_qid : items[i].DbQid,
          payer_name : payer_name,
          payer_nick_name : payer_nick_name,
          receiver_name : receiver_name,
          receiver_nick_name : receiver_nick_name,
          cash : items[i].Cash,
          remark : items[i].Remark,
        })
      }
      console.log(tableData)
    }
  ).catch(
    (error) => {
      console.log(error)
    }
  )
}

let payInput = (row, column, event) => {
  if (row.payer_name == store.state.userName) {
    
    console.log(row)
    url.value = row.receiver_name + ".jpg"
    sessionStorage.setItem("toPayUserName",row.receiver_name)
    sessionStorage.setItem("toPayCash",row.cash)
    sessionStorage.setItem("statementQid",row.db_qid)
    dialogPayVisiable.value = true
  } else {
    ElMessage.info("TODO 这里对要付款的人进行提醒")
  }
}

let afterPay = () => {
  axios({
    url : 'http://127.0.0.1:8080/api/gcas/payinput',
    method : 'post',
    headers: {
        'Content-Type': 'application/json'
    },
    params:{
        userName: store.state.userName,
        token: store.state.token
    },
    data:{
      UserName: sessionStorage.getItem("toPayUserName"),
      CashPay: sessionStorage.getItem("toPayCash"),
      StatementQid: sessionStorage.getItem("statementQid")
    }
  }).then( (response) => {
    ElMessage.info("付款完成，该条记录已清除")
    dialogPayVisiable.value = false
    getTableData()
  }).catch((error) => {
    ElMessage.info("服务器内部异常, 请稍后重试\r\n"+error.data.ErrorMsg)
  })
}

let beforeCashOutInput = () => {
  aaPeopleSelected.value.splice(0, aaPeoples.value.length)
  axios({
    url : 'http://127.0.0.1:8080/api/gcas/userquery',
    method : 'get',
    headers: {
        'Content-Type': 'application/json'
    },
    params:{
        userName: store.state.userName,
        token: store.state.token
    }
  }).then( (response) => {
    aaPeoples.value.splice(0, aaPeoples.value.length)
    for(let i=0;i<response.data.UserInfos.length;i++) {
      aaPeoples.value.push({
        userName : response.data.UserInfos[i].UserName,
        userNickName :  response.data.UserInfos[i].UserNickName
      })
    }
    console.log(aaPeoples)
    dialogFormVisible.value = true
  }).catch((error) => {
    console.log(error)
    ElMessage.info("服务器内部异常, 请稍后重试\r\n"+error.data.ErrorMsg)
  })
}

let afterCashOutInput = () => {
  console.log("选中的aapeople" + aaPeopleSelected.value)
    axios({
    url : 'http://127.0.0.1:8080/api/gcas/recordinput',
    method : 'post',
    headers: {
        'Content-Type': 'application/json'
    },
    params:{
        userName: store.state.userName,
        token: store.state.token
    },
    data:{
      UserName: store.state.userName,
      CashOut: form.cashOut,
      AAPeopleCount: "" + aaPeopleSelected.value.length,
      Remark : form.remark,
      AAPeopleUserName: aaPeopleSelected.value
    }
  }).then( (response) => {
    ElMessage.info("账务记录录入成功")
    dialogFormVisible.value = false
    getTableData()
  }).catch((error) => {
    ElMessage.info("服务器内部异常, 请稍后重试\r\n"+error.data.ErrorMsg)
  })
}

onMounted(getTableData)
</script>

<template>
  <p>
    当前与你有关的付款项
  </p>
  <el-button @click="getTableData()">刷新账本</el-button>
  <el-button @click="beforeCashOutInput()">我要记账</el-button>

  <el-table @row-click="payInput" :data="tableData" style="width: 40%">
    <el-table-column prop="payer_nick_name" label="应付款人" width="180" />
    <el-table-column prop="receiver_nick_name" label="应收款人" width="180" />
    <el-table-column prop="cash" label="应付款金额"  width="180"/>
    <el-table-column prop="remark" label="备注" />
  </el-table>

  <el-dialog v-model="dialogPayVisiable" title="Tips" width="30%" :before-close="handleClose">
    <span>要进行付款吗？下面这个是付款码</span>
    <p/>
     <el-image :src="url" :fit="fit" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogPayVisiable = false">再等等</el-button>
        <el-button type="primary" @click="afterPay">我已完成付款</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="dialogFormVisible" title="cashOutInputDialog">
    <el-form :model="form">

      <el-form-item label="出账金额" :label-width="formLabelWidth">
        <el-input v-model="form.cashOut" autocomplete="off" />
      </el-form-item>

      <el-form-item label="备注" :label-width="formLabelWidth">
        <el-input v-model="form.remark" autocomplete="off" />
      </el-form-item>

      <el-form-item label="AA人" :label-width="formLabelWidth">
        <el-checkbox-group class="checkbox-inline" v-model="aaPeopleSelected" v-for="item in aaPeoples">
          <el-checkbox :label="item.userName">{{item.userNickName}}</el-checkbox>/>
        </el-checkbox-group>
      </el-form-item>

    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="afterCashOutInput()">Confirm</el-button>
      </span>
    </template>
  </el-dialog>

</template>
<style>
.el-button {
  margin: 4px;
}
</style>
