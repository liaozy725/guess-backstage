// 所有竞猜
<template>
  <div class="recharge">
    <game-tabs :closable="false" :addable="false" @tabChange="tabChange"></game-tabs>
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
        <div class="serchBtn  pan-btn green-btn" @click="addGuessVisible=true;guessId='';">添加竞猜</div>
      </div>
    </div>

    <el-card class="box-card">
      <el-table :data="tableData" style="width: 100%" stripe fit highlight-current-row v-loading="tableLoding">
        <el-table-column type="index" :index="indexMethod" width="90" label="序号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="name" label="竞猜名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="matchName" label="赛事" header-align="center" align="center"></el-table-column>
        <el-table-column prop="number" label="局数" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createTime" label="比赛时间" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.matchTime | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="team" label="战队" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag class="team-tag" v-for="(value,key,index) in scope.row.team" :key='index'>{{value}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" header-align="center" align="center"></el-table-column>
        <el-table-column label="操作" header-align="center" width="160" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="getDetail(scope.row,false)">详情</el-button>
            <el-button type="text" size="small" @click="deleteGuess(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageNum="pageNum" :total="total" :pageSize="pageSize" v-on:handleSizeChange="handleSizeChange" v-on:handleCurrentChange="handleCurrentChange"></pagination>
    </el-card>
    <!-- 添加竞猜 -->
    <add-guess :guessId="guessId" :selectGameId="selectGameId" :visible="addGuessVisible" @handleClose="addGuessVisible = false;" @handleConfirm="handleConfirmAdd"></add-guess>
    <!-- 编辑竞猜详情 -->
    <edit-guess :guessId="guessId" :visible="editGuessVisible" @handleClose="editGuessVisible = false;guessId='';" @handleConfirm="handleConfirmEdit"></edit-guess>
    <!-- 操作竞猜 -->
    <handle-guess :visible="handleGuessVisible" @handleClose="handleGuessVisible = false;" @handleConfirm="handleConfirmHandle"></handle-guess>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination.vue'
import GameTabs from '@/components/GameTabs.vue'
import AddGuess from '@/components/AddGuess.vue'
import editGuess from '@/components/editGuess.vue'
import HandleGuess from '@/components/HandleGuess.vue'
import { indexMethod } from '@/utils/vx'
export default {
  components: {
    Pagination, GameTabs, AddGuess, HandleGuess, editGuess
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
      addGuessVisible: false,
      editGuessVisible: false, // 编辑竞猜
      handleGuessVisible: false,
      selectGameId: '', // 选中的游戏
      guessId: ''
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
    selectList() {
      this.pageNum = 0;
      this.getList()
    },
    // 获取列表
    getList() {
      var params = {
        token: this.$store.state.user.token,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        gameId: this.selectGameId
      }
      this.tableLoding = true;
      this.$http.post('guess/list', params).then(res => {
        this.tableLoding = false;
        if (res.retCode == 0) {
          res.data.forEach(ele => {
            try {
              ele.team = JSON.parse(ele.team)
            } catch (error) {

            }
          });
          this.tableData = res.data;
          this.total = parseInt(res.pageCount);
        }
      })
    },
    // 标签改变
    tabChange(gameId) {
      this.selectGameId = parseInt(gameId);
      this.pageNum = 0;
      this.getList();
    },
    // 添加竞猜完成回调
    handleConfirmAdd() {
      this.addGuessVisible = false;
      this.pageNum = 0;
      this.getList();
    },
    // 编辑竞猜回调
    handleConfirmEdit() {
      this.editGuessVisible = false;
    },
    // 操作竞猜完成回调
    handleConfirmHandle() {

    },
    // 查看竞猜详情
    getDetail(item, isEdit) {
      this.guessId = item.id;
      this.editGuessVisible = true;
    },
    // 删除竞猜
    deleteGuess(item){
      this.$confirm('此操作将永久删除该竞猜数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        let params = {
          guessId: item.id,
          token: this.$store.state.user.token
        }
        this.$http.post('guess/delGuess',params).then(res=>{
          if (res.retCode == 0) {
            this.$message({
              showClose: true,
              message: "操作成功",
              type: "success"
            });
            this.getList();
          }
        })
      }).catch(()=>{})
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tag {
  margin: 2px 4px 2px 0;
}
.search{
  min-height:auto;
}
</style>
