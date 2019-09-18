// 赛事管理
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
        <div class="serchBtn  pan-btn green-btn" @click="addMatch">添加赛事</div>
      </div>
    </div>

    <el-card class="box-card">
      <el-table :data="tableData" style="width: 100%" stripe fit highlight-current-row v-loading="tableLoding">
        <el-table-column type="index" :index="indexMethod" width="90" label="序号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="title" label="标题" header-align="center" align="center"></el-table-column>
        <el-table-column prop="content" label="赛事介绍" header-align="center" align="center"></el-table-column>
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
            <el-button type="text" size="small" @click="editMatch(scope.row)">编辑</el-button>
            <el-button type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageNum="pageNum" :total="total" :pageSize="pageSize" v-on:handleSizeChange="handleSizeChange" v-on:handleCurrentChange="handleCurrentChange"></pagination>
    </el-card>

    <el-dialog :visible.sync="visible" :title="formData.id?'编辑赛事':'添加赛事'" center top="10vh" :close-on-click-modal="false">
      <el-form :model="formData" :rules="callRules" ref="formRef" label-width="90px" class="demo-dynamic">
        <el-form-item prop="title" label="赛事标题">
          <el-input placeholder="请输入赛事标题" v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item prop="content" label="赛事介绍">
          <el-input placeholder="请输入赛事介绍" type="textarea" :autosize="{ minRows: 3}" v-model="formData.content"></el-input>
        </el-form-item>
        <el-form-item prop="gameId" label="游戏">
          <el-select v-model="formData.gameId" placeholder="请选择游戏" clearable style="width:100%;">
            <el-option v-for="item in gameList" :label="item.gameName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible=false;">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="confirmFun()">确 定</el-button>
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
      visible:false,
      btnLoading:false,
      selectGameId:'',
      callRules: {
        title: [{ required: true, message: '请输入赛事标题', trigger: 'change' }],
        content: [{ required: true, message: '请选择类型', trigger: 'change' }],
        gameId:''
      },
      formData:{
        title:'',
        content:'',
        gameId:''
      },
      stateObj:{'normal':'正常','freeze':'冻结'}
    }
  },
  created() {

  },
  computed: {
    gameList() {
      return this.$store.state.user.gameList;
    }
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
      this.$http.post('match/list',params).then(res=>{
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
    // 确定 添加 /编辑 赛事
    confirmFun(){
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          let params = Object.assign({ token: this.$store.state.user.token }, this.formData);
          this.$http.post('match/operation', params).then(res => {
            if (res.retCode == 0) {
              this.visible = false;
              this.formData = {
                teamName: '',
                teamContent: '',
                gameId: '',
                teamPic: ''
              }
              this.$message({ showClose: true, message: "操作成功", type: "success" });
              this.getList()
            }
          })
        }
      })
    },
    // 编辑赛事
    editMatch(item){
      this.formData = item;
      this.visible = true;
    },
    // 添加赛事
    addMatch(){
      this.formData = {
        title: '',
        content: '',
        gameId: this.selectGameId,
        teamPic: ''
      }
      this.visible=true;
      if(this.$refs['formRef'])this.$refs['formRef'].resetFields();
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
