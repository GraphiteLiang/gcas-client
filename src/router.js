import {createRouter, createWebHistory} from 'vue-router'
import LoginView from "./components/LoginView.vue"
import StatementView from "./components/StatementView.vue"


const router = new createRouter({
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

export default router
