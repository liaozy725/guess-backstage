<template>
  <div class="game-tabs">
    <div class="tabs-box">
      <el-tabs
        :closable="closable"
        tab-position="top"
        v-model="selectedTabs"
        @tab-click="tabClick"
        @tab-remove="tabRemove"
        @tab-add="tabAdd"
      >
        <el-tab-pane v-for="item in tabList" :label="item.gameName" :name="item.id+''"></el-tab-pane>
      </el-tabs>
      <div class="tabs-btns">
        <el-button size='small' type="success" @click="editTab"><i class="el-icon-edit"></i></el-button>
        <el-button @click="tabAdd" size='small' type="primary"><i class="el-icon-plus"></i></el-button>
      </div>
    </div>

    <el-dialog :visible.sync="visible" :title="formData.id?'编辑游戏':'添加游戏'" center top="10vh" :close-on-click-modal="false">
      <el-form
        :model="formData"
        :rules="callRules"
        ref="addGameForm"
        label-width="90px"
        class="demo-dynamic"
      >
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
          <upload
            accept="image/*"
            listType="picture-card"
            :limit="1"
            :multiple="false"
            :fileListData="fileListData"
            @uploadSuccess="uploadSuccess"
            @uploadRemove="uploadRemove"
          ></upload>
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
import Upload from "@/components/Upload.vue";
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
      tabList: this.$store.state.user.gameList || [],
      visible: false,
      btnLoading: false,
      showMenu: false,
      fileListData:[],
      callRules: {
        gameName: [
          { required: true, message: "请输入战队名称", trigger: "blur" }
        ],
        number: [{ required: true, message: "请输入战队数", trigger: "blur" }],
        peopleNum: [
          { required: true, message: "请输入单场人数", trigger: "blur" }
        ]
      },
      formData: {
        gameName: "",
        number: "",
        peopleNum: "",
        gamePic: ""
      },
      position: {
        top: 0,
        left: 0
      }
    };
  },
  components: { Upload },
  created() {
    if (
      !this.$store.state.user.gameList ||
      this.$store.state.user.gameList.length <= 0
    ) {
      this.getGameList();
    } else {
      this.selectedTabs =
        this.$store.state.app.activeGameTab ||
        this.$store.state.user.gameList[0].id + "";
      this.$emit("tabChange", this.selectedTabs);
    }
  },
  methods: {
    // 点击
    tabClick(e) {
      this.$emit("tabChange", e.name);
      this.$store.commit("setActiveGameTab", e.name);
    },
    // 删除游戏
    tabRemove(name) {
      this.$confirm("此操作将永久删除该游戏, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            token: this.$store.state.user.token,
            id: name
          };
          this.$http.post("game/delGame", params).then(res => {
            if (res.retCode == 0) {
              this.getGameList();
            }
          });
        })
        .catch(() => {});
    },
    // 添加游戏
    tabAdd(e) {
      this.formData= {
        gameName: "",
        number: "",
        peopleNum: "",
        gamePic: ""
      }
      this.fileListData =[];
      this.visible = true;
    },
    // 编辑游戏
    editTab(){
      let index = this.tabList.findIndex((item)=>{
        return item.id == this.selectedTabs
      })
      this.formData = JSON.parse(JSON.stringify(this.tabList[index]));
      this.fileListData = [{name:'',url:this.formData.gamePic}];
      this.visible = true
    },
    // 确定新建游戏
    confirmAddTabs() {
      this.$refs["addGameForm"].validate(valid => {
        if (valid) {
          let params = Object.assign(
            { token: this.$store.getters.token },
            this.formData
          );
          this.$http.post("game/operation", params).then(res => {
            if (res.retCode == 0) {
              this.visible = false;
              this.$message({
                showClose: true,
                message: "操作成功",
                type: "success"
              });
              this.getGameList();
            }
          });
        }
      });
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
          if (res.data.length > 0) {
            this.selectedTabs = res.data[0].id + "";
            this.$store.commit("setActiveGameTab", this.selectedTabs);
            this.$emit("tabChange", this.selectedTabs);
          }
          this.$store.commit("setGameList", this.tabList);
        }
      });
    },
    // 上传图片回调
    uploadSuccess(res) {
      this.formData.gamePic = res[0];
    },
    // 图片删除回调
    uploadRemove(res) {
      this.formData.gamePic = "";
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
.tabs-box{
  display: flex;
  .el-tabs{
    flex: 1;
  }
  .tabs-btns{
    width: 120px;
    .el-button{
      font-size: 14px;
    }
  }
}
</style>