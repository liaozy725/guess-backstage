<template>
  <div class="add-guess">
    <el-dialog :visible.sync="visible" title="添加竞猜" center top="10vh" :before-close="beforeClose1" :close-on-click-modal="false">
      <el-form :model="formData" :rules="callRules" ref="form1" label-width="90px" class="demo-dynamic">
        <el-form-item prop="gameId" label="游戏">
          <el-select v-model="formData.gameId" placeholder="请选择游戏" clearable style="width:100%;">
            <el-option v-for="item in gameList" :label="item.gameName" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="matchId" label="赛事">
          <el-select v-model="formData.matchId" placeholder="请选择赛事" :disabled="!formData.gameId" clearable style="width:100%;">
            <el-option v-for="item in matchList" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="name" label="比赛名称">
          <el-input placeholder="请输入比赛名称" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item prop="number" label="局数">
          <el-input placeholder="请输入局数" type="number" v-model="formData.number"></el-input>
        </el-form-item>
        <!-- 循环 -->
        <el-form-item prop="teamIds" label="战队">
          <el-select v-model="formData.teamIds" multiple style="width:100%" :disabled="!formData.gameId" value-key="id" filterable placeholder="请选择参赛战队">
            <el-option v-for="item in teamList" :key="item.id" :label="item.teamName" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="matchTime" label="比赛时间">
          <el-date-picker v-model="formData.matchTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择比赛时间"></el-date-picker>
        </el-form-item>
        <el-form-item prop="url" label="直播地址">
          <el-input placeholder="请输入直播地址" v-model="formData.url"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="beforeClose1">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="nextStep()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectGameId: {
      default: ''
    },
    guessId: {
      default: ''
    }
  },
  data() {
    return {
      btnLoading: false,
      callRules: {
        gameId: [{ required: true, message: '请选择游戏', trigger: 'change' }],
        matchId: [{ required: true, message: '请选择赛事', trigger: 'change' }],
        name: [{ required: true, message: '请输入比赛名称', trigger: 'change' }],
        number: [{ required: true, message: '请输入比赛局数', trigger: 'change' }],
        matchTime: [{ required: true, message: '请选择比赛时间', trigger: 'change' }]
      },
      formData: {
        gameId: '',
        matchId: '',
        name: '',
        number: '',
        matchTime: '',
        teamIds: '',
        teamNames: '',
        url:''
      },
      activeTab: 'first',
      matchList: [],// 竞猜内容列表
      teamList: [], // 战队列表
    }
  },
  computed: {
    gameList() {
      return this.$store.state.user.gameList;
    }
  },
  methods: {
    // 弹框关闭前
    beforeClose1() {
      this.$emit("handleClose", false);
    },
    // 下一步
    nextStep() {
      this.$refs['form1'].validate(valid => {
        if (valid) {
          let params = Object.assign({ token: this.$store.state.user.token }, this.formData);
          let teamIds = [], teamNames = [];
          params.teamIds.forEach(ele => {
            teamIds.push(ele.id);
            teamNames.push(ele.teamName);
          });
          params.teamIds = teamIds.join();
          params.teamNames = teamNames.join();
          this.$http.post('guess/operation', params).then(res => {
            if (res.retCode == 0) {
              this.formData = {
                gameId: '',
                matchId: '',
                name: '',
                number: '',
                matchTime: '',
                teamIds: '',
                teamNames: '',
                url: ''
              };
              this.$emit("handleConfirm");
            }
          })
        }
      })
    },
    // 根据游戏获取赛事列表
    getMatchList() {
      var params = {
        token: this.$store.state.user.token,
        pageNum: 0,
        pageSize: 1000,
        gameId: this.formData.gameId
      }
      this.$http.post('match/list', params).then(res => {
        if (res.retCode == 0) {
          this.matchList = res.data;
        }
      })
    },
    // 根究游戏获取战队列表
    getTeamList() {
      var params = {
        token: this.$store.state.user.token,
        pageNum: 0,
        pageSize: 1000,
        gameId: this.formData.gameId
      }
      this.$http.post('gameTeam/list', params).then(res => {
        if (res.retCode == 0) {
          res.data.forEach(ele => {
            try {
              ele.team = JSON.parse(ele.team)
            } catch (error) {

            }
          });
          this.teamList = res.data;
        }
      })
    },
  },
  watch: {
    // 监听选中游戏改变
    selectGameId(newVal) {
      this.formData.gameId = newVal;
    },
    'formData.gameId'(newVal) {
      this.formData.matchId = '';
      this.getMatchList();
      this.getTeamList();
    },
    // 监听选中游戏改变
    guessId(newVal) {
      if (this.visible) {

      }
    }
  }
}
</script>

<style lang="scss" scoped>
.add-guess {
  .guess-list-container {
    .guess-list {
      .list-box {
        margin-bottom: 20px;
        .card-item-list {
          margin: 0 !important;
          background: #eee;
          .el-col {
            display: flex;
            align-items: center;
            padding: 10px;
            padding-right: 0 !important;
            border-top: 1px solid #999;
            .item-l {
              flex: 0 0 150px;
            }
            .item-r {
              flex: 1;
              .el-input {
                width: 150px;
              }
            }
            &:nth-child(2n + 1) .item-r {
              border-right: 1px solid #ccc;
            }
            &:nth-child(1),
            &:nth-child(2) {
              border-top: 0;
            }
          }
        }
      }
    }
  }
}
</style>