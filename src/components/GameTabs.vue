<template>
  <div class="game-tabs">
    <el-tabs :addable="addable" :closable="closable" tab-position="top" v-model="selectedTabs" @tab-click="tabClick" @tab-remove="tabRemove" @tab-add="tabAdd">
      <el-tab-pane v-for="item in tabList" :label="item.gameName" :name="item.id+''"></el-tab-pane>
    </el-tabs>

    <el-dialog :visible.sync="visible" title="添加游戏" center top="10vh" :close-on-click-modal="false">
      <el-form :model="formData" :rules="callRules" ref="addGameForm" label-width="90px" class="demo-dynamic">
        <el-form-item prop="gameName" label="游戏名称">
          <el-input placeholder="请输入游戏名称" v-model="formData.gameName"></el-input>
        </el-form-item>
        <el-form-item prop="number" label="战队数">
          <el-input placeholder="请输入战队数" type="number" v-model="formData.number"></el-input>
        </el-form-item>
        <el-form-item prop="peopleNum" label="单场人数">
          <el-input placeholder="请输入游戏名称" type="number" v-model="formData.peopleNum"></el-input>
        </el-form-item>
        <el-form-item prop="gamePic" label="游戏图标">
          <upload accept="image/*" :limit="1" :multiple="false" @uploadSuccess="uploadSuccess"></upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible=false;">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="confirmAddTabs()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Upload from '@/components/Upload.vue';
export default {
  props: {
    addable: {
      type: Boolean,
      default: true
    },
    closable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      selectedTabs: "",
      tabList: [],
      visible: false,
      btnLoading: false,
      callRules: {
        gameName: [
          { required: true, message: "请输入战队名称", trigger: "blur" }
        ],
        number: [
          { required: true, message: "请输入战队数", trigger: "blur" }
        ],
        peopleNum: [
          { required: true, message: "请输入单场人数", trigger: "blur" }
        ]
      },
      formData: {
        gameName: "",
        number: "",
        peopleNum: ""
      }
    };
  },
  components: { Upload },
  created() {
    this.getGameList();
  },
  methods: {
    // 点击
    tabClick(e) {
      this.$emit("tabChange",e.name);
    },
    // 删除游戏
    tabRemove(name) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$emit("tabRemove", name);
      }).catch(() => { });
    },
    // 添加游戏
    tabAdd(e) {
      this.visible = true;
    },
    // 确定新建游戏
    confirmAddTabs() {
      this.$refs['addGameForm'].validate(valid => {
        if (valid) {
          let params = Object.assign({ gamePic: '//ossweb-img.qq.com/images/lol/v3/logo.png', token: this.$store.getters.token }, this.formData);
          this.$http.post('game/operation', params).then(res => {
            if (res.retCode == 0) {
              this.visible = false;
              this.$message({ showClose: true, message: "操作成功", type: "success" });
              this.getGameList();
            }
          })
        }
      })
    },
    // 获取游戏列表
    getGameList() {
      let params = {
        token: this.$store.getters.token,
        pageNum: 0,
        pageSize: 1000
      };
      this.$http.post("game/list", params).then(res => {
        if (res.retCode == 0) {
          this.tabList = res.data;
          if(res.data.length>0){
            this.selectedTabs = res.data[0].id+'';
            this.$emit("tabChange",this.selectedTabs);
          }
          this.$store.commit('setGameList',this.tabList);
        }
      });
    },
    // 上传图片回调
    uploadSuccess(res) {
      console.log(res);

    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.game-tabs {
  /deep/ .el-tabs__new-tab {
    color: #fff;
    font-weight: bold;
    border: 1px solid $defaultBule;
    background: $defaultBule;
    width: 30px;
    height: 30px;
    margin-top: 10px;
    margin-bottom: 0;
    i {
      font-size: 28px;
    }
  }
}
</style>