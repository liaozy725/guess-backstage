// 战队管理
<template>
  <div class="recharge">
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
        <div class="serchBtn pan-btn pink-btn" @click="selectList()">查询</div>
      </div>
    </div>

    <el-card class="box-card">
      <el-table :data="tableData" style="width: 100%" stripe fit highlight-current-row v-loading="tableLoding">
        <el-table-column type="index" :index="indexMethod" width="90" label="序号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="accountLogin" label="用户名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="invitationCode" label="邀请码" header-align="center" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="创建时间" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{stateObj[scope.row.state]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" width="160" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" v-if="scope.row.state == 'normal'" @click="uploadUserState(scope.row)">冻结</el-button>
            <el-button type="text" size="small" v-else @click="uploadUserState(scope.row)">解冻</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageNum="pageNum" :total="total" :pageSize="pageSize" v-on:handleSizeChange="handleSizeChange" v-on:handleCurrentChange="handleCurrentChange"></pagination>
    </el-card>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import { indexMethod } from "@/utils/vx";
export default {
  components: {
    Pagination
  },
  data() {
    return {
      tableData: [],
      tableLoding: false,
      total: 0, // 总页数
      pages: 1, // 第一次请求页
      pageNum: 0, // 当前页数
      pageSize: 10, // 每页显示个数
      mobile: "",
      stateObj: { normal: "正常", freeze: "冻结" }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    indexMethod: indexMethod,
    // 一页展示数量改变
    handleSizeChange(pageSize) {
      this.tableData = [];
      this.pageSize = pageSize;
      this.pageNum = 0;
      this.getList();
    },
    // 分页处理 - 改变 pageNum
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.getList();
    },
    // 查询
    selectList() {
      this.pageNum = 0;
      this.getList();
    },
    // 获取列表
    getList() {
      let params = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        token: this.$store.getters.token
      };
      this.tableLoding = true;
      this.$http.post("userInfo/list", params).then(res => {
        this.tableLoding = false;
        if (res.retCode == 0) {
          this.tableData = res.data;
          this.total = parseInt(res.pageCount);
        }
      });
    },
    // 冻结 解冻
    uploadUserState(item){
      let params = {
        id:item.id,
        token: this.$store.getters.token
      };
      this.$http.post("userInfo/update", params).then(res => {
        if (res.retCode == 0) {
          this.$message({showClose:true,message:'操作成功',type:'success'})
          this.getList();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
