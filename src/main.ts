import { createApp } from "vue";
import App from "./App.vue";
import { createStore } from 'vuex'
// import "~/styles/element/index.scss";

// import ElementPlus from "element-plus";
// import all element css, uncommented next line
// import "element-plus/dist/index.css";

// or use cdn, uncomment cdn link in `index.html`

import "~/styles/index.scss";

// If you want to use ElMessage, import it.
import "element-plus/theme-chalk/src/message.scss"
import {createRouter, createWebHistory} from 'vue-router'
import LoginView from "./components/LoginView.vue"
import StatementView from "./components/StatementView.vue"


const router = createRouter({
    history: createWebHistory(),
    routes :[
        {
            path:'/',
            redirect:'/index'
        },
        {
            path:'/index',
            component:LoginView
        },
        {
            path:'/StatementView',
            component: StatementView
        },
    ]
})

const store = createStore({
    state () {
      return {
        userName : "",
        token : "",
        tmp: ""
      }
    },
    mutations: {
      userName(state, userName) {
          state.userName = userName
      },
      token(state, token) {
        state.token = token
      },
      tmp(state, tmp) {
        state.tmp = tmp
      }
    }
  })
const app = createApp(App);


app.use(router)
app.use(store)
app.mount("#app");