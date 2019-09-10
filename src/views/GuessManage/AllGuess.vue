// 所有竞猜
<template>
  <div class="recharge">
    <game-tabs :closable="false" :addable="false" @tabChange="tabChange"></game-tabs>
    <div class="search clearfix">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
          <div class="item">
            <span class="tit">手机号</span>
            <el-input clearable v-model="mobile" placeholder="请输入手机号" @keyup.enter.native="selectList()"></el-input>
          </div>
        </el-col>
      </el-row>
      <div class="oneTerm">
        <div class="serchBtn  pan-btn pink-btn" @click="selectList()">查询</div>
        <div class="serchBtn  pan-btn green-btn" @click="addGuessVisible=true;">添加竞猜</div>
      </div>
    </div>

    <el-card class="box-card">
      <el-table :data="tableData" style="width: 100%" stripe fit highlight-current-row v-loading="tableLoding">
        <el-table-column type="index" :index="indexMethod" width="90" label="序号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="headImage" label="比赛名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="nickName" label="赛事" header-align="center" align="center"></el-table-column>
        <el-table-column prop="nickName" label="状态" header-align="center" align="center"></el-table-column>
        <el-table-column prop="nickName" label="开始时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="nickName" label="结束时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="nickName" label="局数" header-align="center" align="center"></el-table-column>
        <el-table-column prop="nickName" label="性质" header-align="center" align="center"></el-table-column>
        <el-table-column label="操作" header-align="center" width="160" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :currentPage="currentPage" :total="total" :pageSize="pageSize" v-on:handleSizeChange="handleSizeChange" v-on:handleCurrentChange="handleCurrentChange"></pagination>
    </el-card>
    <!-- 添加竞猜 -->
    <add-guess :visible="addGuessVisible" @handleClose="addGuessVisible = false;" @handleConfirm="handleConfirmAdd"></add-guess>
    <!-- 操作竞猜 -->
    <handle-guess :visible="handleGuessVisible" @handleClose="handleGuessVisible = false;" @handleConfirm="handleConfirmHandle"></handle-guess>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination.vue'
import GameTabs from '@/components/GameTabs.vue'
import AddGuess from '@/components/AddGuess.vue'
import HandleGuess from '@/components/HandleGuess.vue'
import { indexMethod } from '@/utils/vx'
export default {
  components: {
    Pagination,GameTabs,AddGuess,HandleGuess
  },
  data() {
    return {
      tableData: [],
      tableLoding: false,
      total: 0, // 总页数
      pages: 1, // 第一次请求页
      currentPage: 1, // 当前页数
      pageSize: 10, // 每页显示个数
      applyTime: '',
      mobile: '',
      nickName: '',
      realName: '',
      addGuessVisible:false,
      handleGuessVisible:true,
      btnLoading:false,
      callRules: {
        name: [{ required: true, message: '请输入战队名称', trigger: 'change' }],
        teamNun: [{ required: true, message: '请输入战队数', trigger: 'change' }]
      },
      formData:{
        game:'',
        name:'',
        teamNun:''
      }
    }
  },
  created() {

  },
  methods: {
    indexMethod: indexMethod,
    // 一页展示数量改变
    handleSizeChange(pageSize) {
      this.tableData = [];
      this.pageSize = pageSize
      this.currentPage = 1;
      this.getList()
    },
    // 分页处理 - 改变 currentPage
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getList()
    },
    // 查询
    selectList(){
      this.currentPage = 1;
      this.getList()
    },
    // 获取列表
    getList(){

    },
    // 标签改变
    tabChange(e){

    },
    // 添加竞猜完成回调
    handleConfirmAdd(){

    },
    // 操作竞猜完成回调
    handleConfirmHandle(){
      
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
