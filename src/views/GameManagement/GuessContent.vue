// 战队管理
<template>
  <div class="recharge">
    <game-tabs @tabChange="tabChange"></game-tabs>
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
        <el-table-column prop="title" label="标题" header-align="center" align="center"></el-table-column>
        <el-table-column prop="type" label="类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="percentage" label="抽成" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="更新时间" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="状态" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{stateObj[scope.row.state]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" width="160" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small">编辑</el-button>
            <el-button type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageNum="pageNum" :total="total" :pageSize="pageSize" v-on:handleSizeChange="handleSizeChange" v-on:handleCurrentChange="handleCurrentChange"></pagination>
    </el-card>

    <el-dialog :visible.sync="visibleTeam" :title="formData.id?'编辑竞猜内容':'添加竞猜内容'" center top="10vh">
      <el-form :model="formData" :rules="callRules" ref="call" label-width="90px" class="demo-dynamic">
        <el-form-item prop="title" label="竞猜标题">
          <el-input placeholder="请输入竞猜标题" v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item prop="type" label="类型" placeholder="请选择类型">
          <el-select v-model="formData.type" style="width:100%">
            <el-option label="战队" value="战队"></el-option>
            <el-option label="单人" value="单人"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="guessPrice" label="资金池">
          <el-input placeholder="请输入资金池" type="number" v-model="formData.guessPrice"></el-input>
        </el-form-item>
        <el-form-item prop="percentage" label="抽成">
          <el-input placeholder="请输入抽成" type="number" v-model="formData.percentage"></el-input>
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
      pageNum: 0, // 当前页数
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
      },
      selectGameId:'',
      stateObj:{'normal':'正常','freeze':'冻结'}
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
      this.pageNum = 0;
      this.getList()
    },
    // 分页处理 - 改变 pageNum
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.getList()
    },
    // 查询
    selectList(){
      this.pageNum = 0;
      this.getList()
    },
    // 获取列表
    getList(){
      var params = {
        token:this.$store.state.user.token,
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        gameId:this.selectGameId
      }
      this.tableLoding = true;
      this.$http.post('guessContent/list',params).then(res=>{
        this.tableLoding = false;
        if(res.retCode==0){
          this.tableData = res.data;
        }
      })
    },
    // 标签改变 根据游戏来获取列表
    tabChange(gameId) {
      this.selectGameId = parseInt(gameId);
      this.getList();
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
