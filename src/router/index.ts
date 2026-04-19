import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: Layout,
            redirect: '/designer',
            children: [
                {
                    path: 'designer',
                    name: 'Designer',
                    component: () => import('@/views/designer/index.vue'),
                    meta: { title: '流程設計器', icon: 'Edit' }
                },
                {
                    path: 'process',
                    name: 'Process',
                    component: () => import('@/views/process/index.vue'),
                    meta: { title: '流程管理', icon: 'Document' }
                },
                {
                    path: 'instance',
                    name: 'Instance',
                    component: () => import('@/views/instance/index.vue'),
                    meta: { title: '流程實例', icon: 'List' }
                },
                {
                    path: 'task',
                    name: 'Task',
                    component: () => import('@/views/task/index.vue'),
                    meta: { title: '任務管理', icon: 'Check' }
                },
                {
                    path: 'history',
                    name: 'History',
                    component: () => import('@/views/history/index.vue'),
                    meta: { title: '歷史查詢', icon: 'Clock' }
                }
            ]
        },
        { path: '/:pathMatch(.*)*', redirect: '/' }
    ]
})

export default router