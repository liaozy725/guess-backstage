// 战队管理
<template>
  <div class="recharge">
    <game-tabs @tabChange="tabChange" @tabRemove="tabRemove"></game-tabs>
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
        <div class="serchBtn  pan-btn green-btn" @click="visibleTeam=true;">添加竞猜内容</div>
      </div>
    </div>

    <el-card class="box-card">
      <el-table :data="tableData" style="width: 100%" stripe fit highlight-current-row v-loading="tableLoding">
        <el-table-column type="index" :index="indexMethod" width="90" label="序号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="headImage" label="标题" header-align="center" align="center"></el-table-column>
        <el-table-column prop="nickName" label="类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="mobile" label="默认奖金池" header-align="center" align="center"></el-table-column>
        <el-table-column prop="mobile" label="抽成" header-align="center" align="center"></el-table-column>
        <el-table-column label="操作" header-align="center" width="160" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small">编辑</el-button>
            <el-button type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :currentPage="currentPage" :total="total" :pageSize="pageSize" v-on:handleSizeChange="handleSizeChange" v-on:handleCurrentChange="handleCurrentChange"></pagination>
    </el-card>

    <el-dialog :visible.sync="visibleTeam" title="添加竞猜内容" center top="10vh">
      <el-form :model="formData" :rules="callRules" ref="call" label-width="90px" class="demo-dynamic">
        <el-form-item prop="memo" label="标题">
          <el-input placeholder="请输入标题" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item prop="memo" label="类型" placeholder="请选择类型">
          <el-select v-model="formData.type" style="width:100%">
            <el-option label="战队" value="战队"></el-option>
            <el-option label="单人" value="单人"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="memo" label="资金池">
          <el-input placeholder="请输入资金池" type="number" v-model="formData.teamNun"></el-input>
        </el-form-item>
        <el-form-item prop="memo" label="抽成">
          <el-input placeholder="请输入抽成" type="number" v-model="formData.teamNun">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visibleTeam=false;">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="confirmTeam()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination.vue'
import GameTabs from '@/components/GameTabs.vue'
import { indexMethod } from '@/utils/vx'
export default {
  components: {
    Pagination,GameTabs
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
      visibleTeam:false,
      btnLoading:false,
      callRules: {
        name: [{ required: true, message: '请输入战队名称', trigger: 'change' }],
        teamNun: [{ required: true, message: '请输入战队数', trigger: 'change' }]
      },
      formData:{
        name:'',
        teamNun:'',
        type:''
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
    // 标签删除
    tabRemove(e){

    },
    // 确定 添加 /编辑 战队
    confirmTeam(){

    }
  }
}
</script>

<style lang="scss" scoped>

</style>
