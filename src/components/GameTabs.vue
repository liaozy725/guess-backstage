<template>
  <div class="game-tabs">
    <el-tabs :addable="addable" :closable="closable" tab-position="top" v-model="selectedTabs" @tab-click="tabClick" @tab-remove="tabRemove" @tab-add="tabAdd">
      <el-tab-pane v-for="item in tabList" :label="item" :name="item"></el-tab-pane>
    </el-tabs>

    <el-dialog :visible.sync="visible" title="添加游戏" center top="10vh">
      <el-form :model="formData" :rules="callRules" ref="call" label-width="90px" class="demo-dynamic">
        <el-form-item prop="memo" label="游戏名称">
          <el-input placeholder="请输入游戏名称" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item prop="memo" label="战队数">
          <el-input placeholder="请输入战队数" type="number" v-model="formData.teamNun"></el-input>
        </el-form-item>
        <el-form-item prop="memo" label="单场人数">
          <el-input placeholder="请输入游戏名称" type="number" v-model="formData.peopleNum"></el-input>
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
      selectedTabs: '英雄联盟',
      tabList: ["英雄联盟", "Dota2", "守望先锋"],
      visible: false,
      btnLoading: false,
      callRules: {
        name: [{ required: true, message: '请输入战队名称', trigger: 'change' }],
        teamNun: [{ required: true, message: '请输入战队数', trigger: 'change' }],
        peopleNum: [{ required: true, message: '请输入单场人数', trigger: 'change' }],
      },
      formData: {
        name: '',
        teamNun: '',
        peopleNum: ''
      }
    }
  },
  created() {

  },
  methods: {
    tabClick(e) {
      console.log(e);
      this.$emit("tabChange")
    },
    tabRemove(name) {
      this.$emit("tabRemove")
      console.log(name);
    },
    tabAdd(e) {
      this.visible = true;
    },
    confirmAddTabs() {

    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.game-tabs {
  /deep/ .el-tabs__new-tab {
    color: #fff;
    font-weight: bold;
    border: 1px solid $defaultBule;
    background: $defaultBule;
  }
}
</style>