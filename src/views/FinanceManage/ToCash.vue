// 财务管理
<template>
  <div class="recharge">
    <div class="search clearfix">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
          <div class="item">
            <span class="tit">状态</span>
            <el-select v-model="withdrawState" clearable placeholder='请选择状态' style="width:100%;">
              <el-option v-for="(value,key,index) in stateObj" :label="value" :value="key" :key="key"></el-option>
            </el-select>
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
        <el-table-column prop="accountLogin" label="登录名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="price" label="金额" header-align="center" align="center"></el-table-column>
        <el-table-column prop="bankNo" label="卡号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="bankUserName" label="开户名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="bankName" label="开户银行" header-align="center" align="center"></el-table-column>
        <el-table-column prop="bankBranch" label="开户支行" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="withdrawState" label="状态" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{stateObj[scope.row.withdrawState]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" width="160" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" v-if="scope.row.withdrawState == 'applying'" @click="auditWithdraw(scope.row)">审核</el-button>
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
      stateObj: { 'applying': '申请中', 'agree': '同意', 'refuse': '拒绝' },
      withdrawState: ''
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
      this.pageNum = pageNum -1;
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
        token: this.$store.getters.token,
        withdrawState: this.withdrawState
      };
      this.tableLoding = true;
      this.$http.post("withdraw/queryList", params).then(res => {
        this.tableLoding = false;
        if (res.retCode == 0) {
          this.tableData = res.data;
          this.total = parseInt(res.pageCount);
        }
      });
    },
    // 操作
    auditWithdraw(row) {
      this.$msgbox({
        title: '提现审核',
        message: '是否同意该条提现申请？',
        type: 'warning',
        showCancelButton: true,
        distinguishCancelAndClose:true,
        cancelButtonText: '拒绝',
        confirmButtonText: '同意'
      }).then(() => {
        this.submitAudit(row.id, 'agree')
      }).catch((action) => {
        if(action == 'cancel'){
          this.submitAudit(row.id, 'refuse')
        }
      })
    },
    submitAudit(id, withdrawState) {
      let params = {
        token: this.$store.state.user.token,
        id: id,
        withdrawState: withdrawState
      }
      this.$http.post('withdraw/audit', params).then(res => {
        if (res.retCode == 0) {
          this.$message({ showClose: true, message: "操作成功", type: "success" });
          this.getList();
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
