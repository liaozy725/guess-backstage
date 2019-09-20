// 订单列表
<template>
  <div class="recharge">
    <div class="search clearfix">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
          <div class="item">
            <span class="tit">订单号</span>
            <el-input clearable v-model="orderNo" placeholder="请输入手机号" @keyup.enter.native="selectList()"></el-input>
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
        <el-table-column prop="orderNo" label="订单号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="amount" label="金额" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createTime" label="下单时间" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="transactionTime" label="交易时间" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.transactionTime | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="transferType" label="交易方式" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{transferTypeObj[scope.row.transferType]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column>
        <el-table-column prop="orderType" label="状态" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{orderTypeObj[scope.row.orderType]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" width="100" align="center">
          <template slot-scope="scope">
            <!-- <el-button type="text" size="small" @click="deleteItem(scope.row)">删除</el-button> -->
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
      orderTypeObj: { 'success': '订单成功', 'unpaid': '未付款', 'paid': '已付款', 'outtime': '订单超时', 'invalid': '失效订单' },
      transferTypeObj: { 'alipay': '支付宝', 'wechant': '微信'},
      selectId: '',
      orderNo:''
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
        token: this.$store.getters.token,
        orderNo: this.orderNo
      };
      this.tableLoding = true;
      this.$http.post("order/queryList", params).then(res => {
        this.tableLoding=false;
        if (res.retCode == 0) {
          this.tableData = res.data;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
