// 战队管理
<template>
  <div class="recharge">
    <game-tabs @tabChange="tabChange"></game-tabs>
    <div class="search clearfix">
      <!-- <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
          <div class="item">
            <span class="tit">手机号</span>
            <el-input clearable v-model="mobile" placeholder="请输入手机号" @keyup.enter.native="selectList()"></el-input>
          </div>
        </el-col>
      </el-row> -->
      <div class="oneTerm">
        <!-- <div class="serchBtn  pan-btn pink-btn" @click="selectList()">查询</div> -->
        <div class="serchBtn  pan-btn green-btn" @click="addGuess">添加竞猜内容</div>
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
            <el-button type="text" size="small" @click="editGuess(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageNum="pageNum" :total="total" :pageSize="pageSize" v-on:handleSizeChange="handleSizeChange" v-on:handleCurrentChange="handleCurrentChange"></pagination>
    </el-card>

    <el-dialog :visible.sync="visible" :title="formData.id?'编辑竞猜内容':'添加竞猜内容'" center top="10vh">
      <el-form :model="formData" :rules="callRules" ref="formRef" label-width="90px" class="demo-dynamic">
        <el-form-item prop="title" label="竞猜标题">
          <el-input placeholder="请输入竞猜标题" v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item prop="type" label="类型" placeholder="请选择类型">
          <el-select v-model="formData.type" style="width:100%">
            <el-option v-for="item in typeArr" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="guessPrice" label="资金池">
          <el-input placeholder="请输入资金池" type="number" v-model="formData.guessPrice"></el-input>
        </el-form-item>
        <el-form-item prop="percentage" label="抽成">
          <el-input placeholder="请输入抽成" type="number" v-model="formData.percentage"></el-input>
        </el-form-item>
        <el-form-item prop="gameId" label="游戏">
          <el-select v-model="formData.gameId" placeholder="请选择游戏" clearable style="width:100%;">
            <el-option v-for="item in gameList" :label="item.gameName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible=false;">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="confirm()">确 定</el-button>
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
      typeArr:['1/2','1/3','1/4','1/5','1/6','1/7','1/8','1/9','1/10'],
      callRules: {
        title: [{ required: true, message: '请输入竞猜标题', trigger: 'blur' }],
        percentage: [{ required: true, message: '请输入抽成', trigger: 'blur' }],
        type: [{ required: true, message: '请选择竞猜类型', trigger: 'change' }],
        gameId: [{ required: true, message: '请选择游戏', trigger: 'change' }],
        guessPrice: [{ required: true, message: '请输入资金池', trigger: 'blur' }],
      },
      formData:{
        title:'',
        percentage:'',
        type:'',
        guessPrice:'',
        gameId:''
      },
      selectGameId:'',
      stateObj:{'normal':'正常','freeze':'冻结'}
    }
  },
  computed: {
    gameList() {
      return this.$store.state.user.gameList;
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
      this.pageNum = pageNum -1;
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
          this.total = parseInt(res.pageCount);
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
    confirm(){
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          let params = Object.assign({ token: this.$store.state.user.token }, this.formData);
          this.$http.post('guessContent/operation', params).then(res => {
            if (res.retCode == 0) {
              this.visible = false;
              this.formData = {
                title:'',
                percentage:'',
                type:'',
                guessPrice:'',
                gameId:''
              }
              this.$message({ showClose: true, message: "操作成功", type: "success" });
              this.getList()
            }
          })
        }
      })
    },
    // 编辑赛事
    editGuess(item){
      this.formData = item;
      this.visible = true;
    },
    // 添加竞猜
    addGuess(){
      this.formData = {
        title: '',
        content: '',
        gameId: this.selectGameId,
        teamPic: ''
      }
      this.visible=true;
      if(this.$refs['formRef'])this.$refs['formRef'].resetFields();
    },
    // 删除
    deleteItem(item){
      this.$confirm('此操作将永久删除该竞猜内容, 是否继续?', '提示').then(() => {
        let params = {
          id: item.id,
          token: this.$store.getters.token
        };
        this.$http.post("guessContent/guessContentDel", params).then(res => {
          if (res.retCode == 0) {
            this.$message({ showClose: true, message: "操作成功", type: "success" });
            this.getList();
          }
        });
      }).catch(() => { })
    }
  }
}
</script>

<style lang="scss" scoped>
.search{
  min-height:auto;
}
</style>
