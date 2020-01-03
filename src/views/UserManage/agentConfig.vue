// 消息管理
<template>
  <div class="recharge">
    <div class="search clearfix">
      <div class="oneTerm">
        <div class="serchBtn pan-btn green-btn" @click="createItem">创建代理</div>
      </div>
    </div>

    <el-card class="box-card">
      <el-table :data="tableData" style="width: 100%" stripe fit highlight-current-row v-loading="tableLoding">
        <el-table-column type="index" :index="indexMethod" width="90" label="序号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="accountLogin" label="账号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="userName" label="用户名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="invitationCode" label="邀请码" header-align="center" align="center"></el-table-column>
        <el-table-column prop="userBalance" label="用户余额" header-align="center" align="center"></el-table-column>
        <el-table-column prop="userFrozenBalance" label="冻结余额" header-align="center" align="center"></el-table-column>
        <el-table-column prop="userPrize" label="奖金" header-align="center" align="center"></el-table-column>
        <el-table-column prop="userFrozenPrize" label="冻结奖金" header-align="center" align="center"></el-table-column>
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
            <el-button type="text" size="small" @click="uploadItem(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageNum="pageNum" :total="total" :pageSize="pageSize" v-on:handleSizeChange="handleSizeChange" v-on:handleCurrentChange="handleCurrentChange"></pagination>
    </el-card>

    <el-dialog :visible.sync="visible" :title="formData.id?'修改代理':'创建代理'" center top="10vh" :close-on-click-modal='false'>
      <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="90px" class="demo-dynamic">
        <el-form-item prop="userName" label="用户名">
          <el-input placeholder="请输入用户名" clearable v-model="formData.userName"></el-input>
        </el-form-item>
        <el-form-item prop="mobileNo" label="手机号">
          <el-input placeholder="请输入手机号" clearable v-model="formData.mobileNo"></el-input>
        </el-form-item>
        <el-form-item prop="accountLogin" label="登录账号">
          <el-input placeholder="请输入登录账号" clearable v-model="formData.accountLogin"></el-input>
        </el-form-item>
        <el-form-item prop="accountPassword" label="登录密码">
          <el-input placeholder="请输入登录密码" clearable v-model="formData.accountPassword"></el-input>
        </el-form-item>
        <el-form-item prop="prestore" label="费率">
          <el-input placeholder="请输入费率" type="number" clearable v-model="formData.prestore"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible=false;">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="saveOrUpdate()">确 定</el-button>
      </span>
    </el-dialog>
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
      visible: false,
      btnLoading: false,
      total: 0, // 总页数
      pages: 1, // 第一次请求页
      pageNum: 0, // 当前页数
      pageSize: 10, // 每页显示个数
      mobile: "",
      stateObj: { normal: "正常", freeze: "冻结" },
      formData: {
        userName: "",
        mobileNo: "",
        accountLogin: "",
        accountPassword: "",
        prestore: ""
      },
      rules: {
        userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        mobileNo: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        accountLogin: [{ required: true, message: "请输入登录账号", trigger: "blur" }],
        accountPassword: [{ required: true, message: "请输入登录密码", trigger: "blur" }],
        prestore: [{ required: true, message: "请输入费率", trigger: "blur" }],
      },
      selectId: ""
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
      this.pageNum = pageNum - 1;
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
      this.$http.post("userInfo/agentList", params).then(res => {
        this.tableLoding = false;
        if (res.retCode == 0) {
          this.tableData = res.data;
          this.total = parseInt(res.pageCount);
        }
      });
    },
    // 创建
    createItem(){
      this.formData = {
        userName: "",
        mobileNo: "",
        accountLogin: "",
        accountPassword: "",
        prestore: ""
      }
      this.visible = true
    },
    // 删除
    deleteItem(item) {
      this.$confirm('此操作将永久删除该消息, 是否继续?', '提示').then(() => {
        let params = {
          id: item.id,
          token: this.$store.getters.token
        };
        this.$http.post("sysNotice/delete", params).then(res => {
          if (res.retCode == 0) {
            this.$message({ showClose: true, message: "操作成功", type: "success" });
            this.getList();
          }
        });
      }).catch(() => { })

    },
    // 修改
    uploadItem(item) {
      let { userName, mobileNo, accountLogin, prestore, id } = item;
      this.formData = { userName, mobileNo, accountLogin, accountPassword: '', prestore, id }
      this.visible = true;
    },
    // 保存消息
    saveOrUpdate() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let params = Object.assign({
            token: this.$store.getters.token,
          }, this.formData)
          this.btnLoading = true;
          this.$http.post("userInfo/agentSave", params).then(res => {
            this.btnLoading = false;
            if (res.retCode == 0) {
              this.pageNum = 0;
              this.selectId = "";
              this.formData = {
                userName: "",
                mobileNo: "",
                accountLogin: "",
                accountPassword: "",
                prestore: ""
              };
              this.visible = false;
              this.$message({ showClose: true, message: "操作成功", type: "success" });
              this.getList();
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.search {
  min-height: auto;
}
</style>
