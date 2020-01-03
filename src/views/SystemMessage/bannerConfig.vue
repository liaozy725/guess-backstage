// 轮播管理
<template>
  <div class="recharge">
    <div class="search clearfix">
      <div class="oneTerm">
        <div class="serchBtn pan-btn green-btn" @click="visible=true;">创建广告</div>
      </div>
    </div>

    <el-card class="box-card">
      <el-table :data="tableData" style="width: 100%" stripe fit highlight-current-row v-loading="tableLoding">
        <el-table-column type="index" :index="indexMethod" width="90" label="序号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="title" label="标题" header-align="center" align="center"></el-table-column>
        <el-table-column prop="pic" label="图片" header-align="center" align="center">
          <template slot-scope="scope">
            <el-image style="width:100px;height:100px;" :src="scope.row.pic" :preview-src-list='[scope.row.pic]'></el-image>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="updateTime" label="创建时间" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | parseTime}}</span>
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="state" label="状态" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{stateObj[scope.row.state]}}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" header-align="center" width="160" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteItem(scope.row)">删除</el-button>
            <el-button type="text" size="small" @click="uploadItem(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <pagination :pageNum="pageNum" :total="total" :pageSize="pageSize" v-on:handleSizeChange="handleSizeChange" v-on:handleCurrentChange="handleCurrentChange"></pagination> -->
    </el-card>

    <el-dialog :visible.sync="visible" title="创建广告" center top="10vh">
      <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="90px" class="demo-dynamic">
        <el-form-item prop="title" label="广告标题">
          <el-input placeholder="请输入广告标题" clearable v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item prop="url" label="广告链接">
          <el-input placeholder="请输入广告内容" clearable v-model="formData.url"></el-input>
        </el-form-item>
        <el-form-item prop="pic" label="广告图片">
          <upload accept="image/*" :fileListData="fileListData"  listType="picture-card" :limit="1" :multiple="false" @uploadSuccess="uploadSuccess" @uploadRemove="uploadRemove"></upload>
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
import Upload from '@/components/Upload.vue'
export default {
  components: {
    Pagination,
    Upload
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
        pic: "",
        url: ''
      },
      rules: {
        title: [{ required: true, message: "请输入轮播图标题", trigger: "blur" }],
        pic: [{ required: true, message: "请上传轮播图图片", trigger: "blur" }],
        url: [{ required: true, message: "请输入外链地址", trigger: "blur" }],
      },
      selectId: "",
      fileListData:[]
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
        token: this.$store.getters.token
      };
      this.tableLoding = true;
      this.$http.post("banner/list", params).then(res => {
        this.tableLoding = false;
        if (res.retCode == 0) {
          this.tableData = res.data;
          this.total = parseInt(res.pageCount);
        }
      });
    },
    // 删除
    deleteItem(item) {
      this.$confirm('此操作将永久删除该广告, 是否继续?', '提示').then(() => {
        let params = {
          id: item.id,
          token: this.$store.getters.token
        };
        this.$http.post("banner/delete", params).then(res => {
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
        url: item.url,
        pic: item.pic,
      };
      this.fileListData = [{name:'',url:this.formData.pic}];
      this.visible = true;
    },
    // 保存广告
    saveOrUpdate() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let params = {
            token: this.$store.getters.token,
            title: this.formData.title,
            url: this.formData.url,
            pic: this.formData.pic,
            id: this.selectId
          };
          this.btnLoading = true;
          this.$http.post("banner/save", params).then(res => {
            this.btnLoading = false;
            if (res.retCode == 0) {
              this.pageNum = 0;
              this.selectId = "";
              this.formData = {
                url: "",
                pic: "",
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
    },
    // 上传图片回调
    uploadSuccess(res) {
      this.formData.pic = res[0];
    },
    // 图片删除回调
    uploadRemove(res){
      this.formData.pic = '';
    },
  }
};
</script>

<style lang="scss" scoped>
.search{
  min-height:auto;
}
</style>
