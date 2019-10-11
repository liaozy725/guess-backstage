// 系统设置  分销设置
<template>
  <div class="recharge">
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
        <!-- <div class="serchBtn pan-btn pink-btn" @click="selectList()">查询</div> -->
        <!-- <div class="serchBtn pan-btn green-btn" @click="visible=true;">创建消息</div> -->
      </div>
    </div>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-for="(value,key,index) in configData" :key="key">
          <el-card class="item-card">
            <p class="title">
              <span>{{valueObj[key]}}</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="uploadItem(value,key)">编辑</el-button>
            </p>
            <b class="num">{{value}}</b>
          </el-card>
        </el-col>
      </el-row>

    </el-card>

    <el-dialog :visible.sync="visible" :title="formData.key=='level_one'?'一级分销':'二级分销'" center top="10vh">
      <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="90px" class="demo-dynamic">
        <el-form-item prop="value" label="分销比例">
          <el-input placeholder="请输入分销比例" type="number" clearable v-model="formData.value"></el-input>
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
      configData: {},
      visible: false,
      btnLoading: false,
      mobile: "",
      valueObj: { oneValue: "一级分销", twoValue: "二级分销" },
      formData: {
        key: "",
        value: ""
      },
      rules: {
        // key: [{ required: true, message: "请输入消息标题", trigger: "blur" }],
        value: [
          { required: true, message: "请输入分销比例", trigger: "blur" }
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
        token: this.$store.getters.token
      };
      this.$http.post("sysConfig/list", params).then(res => {
        if (res.retCode == 0) {
          this.configData = res.data;
        }
      });
    },
    // 修改
    uploadItem(value,key) {
      this.formData = {
        key: key == 'oneValue'? 'level_one' : 'level_two',
        value: value
      };
      this.visible = true;
    },
    // 保存消息
    saveOrUpdate() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let params = {
            token: this.$store.getters.token,
            value: this.formData.value,
            key: this.formData.key
          };
          this.btnLoading = true;
          this.$http.post("sysConfig/update", params).then(res => {
            this.btnLoading = false;
            if (res.retCode == 0) {
              this.formData = {
                key: "",
                value: ""
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
.box-card {
  .item-card {
    .num{
      font-size: 48px;
      margin-top: 20px;
      display: block;
    }
  }
}
</style>
