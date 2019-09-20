import Vue from "vue";
import Router from "vue-router";
const _import = require('./_import_' + process.env.NODE_ENV)
import Layout from "@/views/layout/Layout.vue";

import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式

Vue.use(Router);

var router = new Router({
  routes: [
    {
      path: '/login',
      component: _import('Other/login'),
      noDropdown: true,
      hidden: true
    },
    {
      path: '',
      component: Layout,
      redirect: '/GameManagement',
      icon: 'el-icon-edit',
      noDropdown: true,
      hidden: true
    }, 
    {
      path: '/GameManagement',
      component: Layout,
      redirect: '/GameManagement/TeamManagement',
      icon: 'icon-youxiguanli',
      name: '游戏管理',
      children: [
        {path: 'TeamManagement',component: _import('GameManagement/TeamManagement'),meta: {keepAlive: true},name: '战队管理'},
        {path: 'GuessContent',component: _import('GameManagement/GuessContent'),name: '竞猜内容',meta: {keepAlive: true}},
        {path: 'MatchManagement',component: _import('GameManagement/MatchManagement'),name: '赛事管理',meta: {keepAlive: true}}
      ]
    }, 
    {
      path: '/GuessManage',
      component: Layout,
      redirect: '/GuessManage/AllGuess',
      icon: 'icon-jingcai',
      name: '竞猜管理',
      children: [
        {path: 'AllGuess',component: _import('GuessManage/AllGuess'),meta: {keepAlive: true},name: '全部竞猜'},
        {path: 'DoingGuess',component: _import('GuessManage/DoingGuess'),meta: {keepAlive: true},name: '进行中'},
        {path: 'EndGuess',component: _import('GuessManage/EndGuess'),meta: {keepAlive: true},name: '已结束'}
      ]
    }, 
    {
      path: '/UserManage',
      component: Layout,
      redirect: '/UserManage/UserList',
      icon: 'icon-user',
      name: '用户管理',
      children: [
        {path: 'UserList',component: _import('UserManage/UserList'),meta: {keepAlive: true},name: '用户列表'}
      ]
    },
    {
      path: '/orderManage',
      component: Layout,
      redirect: '/orderManage/orderList',
      icon: 'icon-user',
      name: '订单管理',
      children: [
        {path: 'orderList',component: _import('orderManage/orderList'),meta: {keepAlive: true},name: '订单列表'}
      ]
    },
    {
      path: '/FinanceManage',
      component: Layout,
      redirect: '/FinanceManage/Survey',
      icon: 'icon-caiwuguanli',
      name: '财务管理',
      children: [
        {path: 'Survey',component: _import('FinanceManage/Survey'),meta: {keepAlive: true},name: '概况'},
        {path: 'Recharge',component: _import('FinanceManage/Recharge'),meta: {keepAlive: true},name: '充值'},
        {path: 'ToCash',component: _import('FinanceManage/ToCash'),meta: {keepAlive: true},name: '提现审核'}
      ]
    },
    {
      path: '/SystemMessage',
      component: Layout,
      redirect: '/SystemMessage/SystemMessage',
      icon: 'icon-xitongxiaoxi',
      name: '系统消息',
      children: [
        {path: 'SystemMessage',component: _import('SystemMessage/SystemMessage'),meta: {keepAlive: true},name: '系统消息'}
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
  NProgress.done()
})

export default router;