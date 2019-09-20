// 消息管理
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
        <div class="serchBtn pan-btn green-btn" @click="visible=true;">创建消息</div>
      </div>
    </div>

    <el-card class="box-card">
      <el-table :data="tableData" style="width: 100%" stripe fit highlight-current-row v-loading="tableLoding">
        <el-table-column type="index" :index="indexMethod" width="90" label="序号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="title" label="标题" header-align="center" align="center"></el-table-column>
        <el-table-column prop="content" label="内容" header-align="center" align="center"></el-table-column>
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
            <el-button type="text" size="small" @click="deleteItem(scope.row)">删除</el-button>
            <el-button type="text" size="small" @click="uploadItem(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageNum="pageNum" :total="total" :pageSize="pageSize" v-on:handleSizeChange="handleSizeChange" v-on:handleCurrentChange="handleCurrentChange"></pagination>
    </el-card>

    <el-dialog :visible.sync="visible" title="创建消息" center top="10vh">
      <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="90px" class="demo-dynamic">
        <el-form-item prop="title" label="消息标题">
          <el-input placeholder="请输入消息标题" clearable v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item prop="content" label="消息内容">
          <el-input placeholder="请输入消息内容" type="textarea" clearable :autosize="{ minRows: 3}" v-model="formData.content"></el-input>
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
        title: "",
        content: ""
      },
      rules: {
        title: [{ required: true, message: "请输入消息标题", trigger: "blur" }],
        content: [
          { required: true, message: "请输入消息内容", trigger: "blur" }
        ]
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
      this.$http.post("sysNotice/list", params).then(res => {
        if (res.retCode == 0) {
          this.tableData = res.data;
        }
      });
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
      this.selectId = item.id;
      this.formData = {
        title: item.title,
        content: item.content
      };
      this.visible = true;
    },
    // 保存消息
    saveOrUpdate() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let params = {
            token: this.$store.getters.token,
            title: this.formData.title,
            content: this.formData.content,
            id: this.selectId
          };
          this.btnLoading = true;
          this.$http.post("sysNotice/saveOrUpdate", params).then(res => {
            this.btnLoading = false;
            if (res.retCode == 0) {
              this.pageNum = 0;
              this.selectId = "";
              this.formData = {
                content: "",
                title: ""
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
</style>
