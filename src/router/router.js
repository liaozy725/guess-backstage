import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV)
import Layout from '@/views/layout/Layout.vue';

import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式

Vue.use(Router);

var router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/jc/login',
      component: _import('Other/login'),
      noDropdown: true,
      hidden: true
    },
    {
      path: '',
      component: Layout,
      redirect: '/jc/GameManagement',
      icon: 'el-icon-edit',
      noDropdown: true,
      hidden: true
    }, 
    {
      path: '/jc/GameManagement',
      component: Layout,
      redirect: '/jc/GameManagement/TeamManagement',
      icon: 'icon-youxiguanli',
      name: '游戏管理',
      children: [
        {path: 'TeamManagement',component: _import('GameManagement/TeamManagement'),meta: {keepAlive: true},name: '战队管理'},
        {path: 'GuessContent',component: _import('GameManagement/GuessContent'),name: '竞猜内容',meta: {keepAlive: true}},
        {path: 'MatchManagement',component: _import('GameManagement/MatchManagement'),name: '赛事管理',meta: {keepAlive: true}}
      ]
    }, 
    {
      path: '/jc/GuessManage',
      component: Layout,
      redirect: '/GuessManage/AllGuess',
      icon: 'icon-jingcai',
      name: '竞猜管理',
      children: [
        {path: 'AllGuess',component: _import('GuessManage/AllGuess'),meta: {keepAlive: true},name: '全部竞猜'},
        {path: 'DoingGuess',component: _import('GuessManage/DoingGuess'),meta: {keepAlive: true},name: '进行中',hidden:true},
        {path: 'EndGuess',component: _import('GuessManage/EndGuess'),meta: {keepAlive: true},name: '已结束',hidden:true}
      ]
    }, 
    {
      path: '/jc/UserManage',
      component: Layout,
      redirect: '/UserManage/UserList',
      icon: 'icon-yonghu',
      name: '用户管理',
      children: [
        {path: 'UserList',component: _import('UserManage/UserList'),meta: {keepAlive: true},name: '用户列表'},
        {path: 'agentConfig',component: _import('UserManage/agentConfig'),meta: {keepAlive: true},name: '代理管理'},
      ]
    },
    // {
    //   path: '/jc/orderManage',
    //   component: Layout,
    //   redirect: '/orderManage/orderList',
    //   icon: 'icon-menu-ddgl-normal',
    //   name: '订单管理',
    //   children: [
    //     {path: 'orderList',component: _import('orderManage/orderList'),meta: {keepAlive: true},name: '订单列表'}
    //   ]
    // },
    {
      path: '/jc/FinanceManage',
      component: Layout,
      redirect: '/FinanceManage/Survey',
      icon: 'icon-caiwuguanli',
      name: '财务管理',
      children: [
        {path: 'Survey',component: _import('FinanceManage/Survey'),meta: {keepAlive: true},name: '概况'},
        {path: 'Recharge',component: _import('FinanceManage/Recharge'),meta: {keepAlive: true},name: '充值',hidden:true},
        {path: 'OrderList',component: _import('FinanceManage/OrderList'),meta: {keepAlive: true},name: '充值订单'},
        {path: 'ToCash',component: _import('FinanceManage/ToCash'),meta: {keepAlive: true},name: '提现审核'},
      ]
    },
    {
      path: '/jc/SystemMessage',
      component: Layout,
      redirect: '/jc/SystemMessage/SystemMessage',
      icon: 'icon-xitongxiaoxi',
      name: '系统设置',
      children: [
        {path: 'SystemConfig',component: _import('SystemMessage/SystemConfig'),meta: {keepAlive: true},name: '分销设置'},
        {path: 'SystemMessage',component: _import('SystemMessage/SystemMessage'),meta: {keepAlive: true},name: '系统消息'},
        {path: 'bannerConfig',component: _import('SystemMessage/bannerConfig'),meta: {keepAlive: true},name: '广告管理'}
      ]
    },
    {
      path:'*',
      redirect: '/jc/GameManagement/TeamManagement'
    }
  ]
});

router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
  NProgress.done()
})

export default router;