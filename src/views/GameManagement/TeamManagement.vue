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
        <div class="serchBtn  pan-btn green-btn" @click="addTeam">添加战队</div>
      </div>
    </div>

    <el-card class="box-card">
      <el-table :data="tableData" style="width: 100%" stripe fit highlight-current-row v-loading="tableLoding">
        <el-table-column type="index" :index="indexMethod" width="90" label="序号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="teamPic" label="战队LOGO" header-align="center" align="center">
          <template slot-scope="scope">
            <!-- <img width="60" height="60" :src="scope.row.teamPic"> -->
            <el-image :src="scope.row.teamPic" style="width:80px;height:80px;" :preview-src-list='[scope.row.teamPic]'></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="teamName" label="战队名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="teamContent" label="战队介绍" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" width="160" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editTeam(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageNum="pageNum" :total="total" :pageSize="pageSize" v-on:handleSizeChange="handleSizeChange" v-on:handleCurrentChange="handleCurrentChange"></pagination>
    </el-card>

    <el-dialog :visible.sync="visibleTeam" :title="this.formData.id?'编辑战队':'添加战队'" center top="10vh" :before-close="()=>{fileListData=[];visibleTeam=false;}" :close-on-click-modal="false">
      <el-form :model="formData" :rules="callRules" ref="formRef" label-width="90px" class="demo-dynamic">
        <el-form-item prop="teamName" label="战队名称">
          <el-input placeholder="请输入战队名称" v-model="formData.teamName"></el-input>
        </el-form-item>
        <el-form-item prop="teamContent" label="战队介绍">
          <el-input placeholder="请输入战队介绍" type="textarea" :autosize="{ minRows: 3}" v-model="formData.teamContent"></el-input>
        </el-form-item>
        <el-form-item prop="gameId" label="游戏">
          <el-select v-model="formData.gameId" placeholder="请选择游戏" clearable style="width:100%;">
            <el-option v-for="item in gameList" :label="item.gameName" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="gameId" label="战队图标">
          <upload accept="image/*" :fileListData="fileListData" listType="picture-card" :limit="1" :multiple="false" @uploadSuccess="uploadSuccess" @uploadRemove="uploadRemove"></upload>
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
import Upload from '@/components/Upload.vue'
import { indexMethod } from '@/utils/vx'
export default {
  components: {
    Pagination, GameTabs, Upload
  },
  data() {
    return {
      tableData: [],
      tableLoding: false,
      total: 0, // 总页数
      pages: 1, // 第一次请求页
      pageNum: 0, // 当前页数
      pageSize: 10, // 每页显示个数
      mobile: '',
      visibleTeam: false,
      btnLoading: false,
      callRules: {
        teamName: [{ required: true, message: '请输入战队名称', trigger: 'blur' }],
        teamContent: [{ required: true, message: '请输入战队数', trigger: 'blur' }],
        gameId: [{ required: true, message: '请选择游戏', trigger: 'change' }],
      },
      formData: {
        teamName: '',
        teamContent: '',
        gameId: '',
        teamPic: ''
      },
      selectGameId:'', // 选中的游戏id
      stateObj:{'normal':'正常','freeze':'冻结'},
      fileListData:[] // 图片回填
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
      this.pageNum = pageNum -1;
      this.getList()
    },
    // 查询
    selectList() {
      this.pageNum = 0;
      this.getList()
    },
    // 获取列表
    getList(gameId) {
      let params = {
        token: this.$store.state.user.token,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        gameId:this.selectGameId
      }
      this.tableLoding = true;
      this.$http.post('gameTeam/list', params).then(res => {
        this.tableLoding = false;
        if (res.retCode == 0) {
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
    tabRemove(e) {

    },
    // 上传图片回调
    uploadSuccess(res) {
      this.formData.teamPic = res[0];
    },
    // 图片删除回调
    uploadRemove(res){
      this.formData.teamPic = '';
    },
    // 确定 添加 /编辑 战队
    confirmTeam() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          let params = Object.assign({ token: this.$store.state.user.token }, this.formData);
          this.$http.post('gameTeam/operation', params).then(res => {
            if (res.retCode == 0) {
              this.visibleTeam = false;
              this.formData = {
                teamName: '',
                teamContent: '',
                gameId: '',
                teamPic: ''
              }
              this.fileListData = [];
              this.$message({ showClose: true, message: "操作成功", type: "success" });
              this.getList()
            }
          })
        }
      })
    },
    // 编辑战队
    editTeam(item){
      this.formData = item;
      this.visibleTeam = true;
      this.fileListData = [{name:'',url:this.formData.teamPic}];
    },
    // 添加战队
    addTeam(){
      this.formData = {
        teamName: '',
        teamContent: '',
        gameId: this.selectGameId,
        teamPic: '',
      }
      this.visibleTeam=true;
      if(this.$refs['formRef'])this.$refs['formRef'].resetFields();
    },
    // 删除
    deleteItem(item){
      this.$confirm('此操作将永久删除该战队, 是否继续?', '提示').then(() => {
        let params = {
          id: item.id,
          token: this.$store.getters.token
        };
        this.$http.post("gameTeam/gameTeamDel", params).then(res => {
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
