<template>
  <div class="add-guess">
    <!-- 第二步 -->
    <el-dialog :visible.sync="visible" title="添加竞猜" center top="10vh" width="1000px" :before-close="beforeClose" :close-on-click-modal="false">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="flex-item">
          <label class="tit">游戏:</label>
          <span>{{guessInfo.gameName}}</span>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="flex-item">
          <label class="tit">比赛时间:</label>
          <span>{{guessInfo.matchTime | parseTime}}</span>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="flex-item">
          <label class="tit">赛事:</label>
          <span>{{guessInfo.matchName}}</span>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="flex-item">
          <label class="tit">比赛名称:</label>
          <span>{{guessInfo.name}}</span>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="flex-item">
          <label class="tit">局数:</label>
          <span>{{guessInfo.number}}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="flex-item">
          <label class="tit">战队:</label>
          <span>
            <el-tag class="team-tag" v-for="(value,key,index) in guessInfo.team">{{value}}</el-tag>
          </span>
        </el-col>
      </el-row>
      <el-card class="guess-list-container" shadow="never">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane label="总竞猜" name="first"></el-tab-pane>
          <el-tab-pane label="第一局" name="2"></el-tab-pane>
          <el-tab-pane label="第二局" name="3"></el-tab-pane>
          <el-tab-pane label="第三局" name="4"></el-tab-pane>
        </el-tabs>
        <!-- 总竞猜 -->
        <div class="guess-list">
          <!-- 循环 这个 -->
          <el-card class="list-box" v-for="item in guessInfo.guessInfoReps">
            <el-table :data="tableData">
              <el-table-column prop="headImage" label="标题" header-align="center" align="center"></el-table-column>
              <el-table-column prop="headImage" label="类型" header-align="center" align="center"></el-table-column>
              <el-table-column prop="headImage" label="默认资金池" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.money" type="number" placeholder="默认奖金池"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="headImage" label="抽成" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.money" type="number" placeholder="抽成">
                    <template slot="append">%</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="headImage" label="玩法" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.money" placeholder="选择玩法">
                    <el-option label="滚盘" value="滚盘"></el-option>
                    <el-option label="早盘" value="早盘"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" header-align="center" width="80" align="center">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="deleteItem()">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row :gutter="20" class="card-item-list">
              <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                <span class="item-l">RNG</span>
                <div class="item-r">
                  <label>赔率：</label>
                  <el-input v-model="formData.game" type="number" clearable placeholder="赔率"></el-input>
                </div>
              </el-col>
              <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                <span class="item-l">RNG</span>
                <div class="item-r">
                  <label>赔率：</label>
                  <el-input v-model="formData.game" type="number" clearable placeholder="赔率"></el-input>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="beforeClose">取消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submit()">完成</el-button>
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
        matchTime: [{ required: true, message: '请比赛时间', trigger: 'change' }],
      },
      formData: {
        gameId: '',
        matchId: '',
        name: '',
        number: '',
        matchTime: '',
        teamIds: '',
        teamNames: ''
      },
      activeTab: 'first',
      tableData: [1],
      guessInfo: {}
    }
  },
  methods: {
    // 弹框关闭前
    beforeClose() {
      this.$emit("handleClose", false);
    },
    // 完成
    submit() {
      this.$emit("handleConfirm")
    },
    handleTabClick() {

    },
    // 获取竞猜详情
    getGuessInfo(number) {
      let params = {
        token: this.$store.state.user.token,
        guessId: this.guessId
      }
      if (number) params.number = number;
      this.$http.post('guess/info', params).then(res => {
        if (res.retCode == 0) {
          try {
            res.data.team = JSON.parse(res.data.team);
          } catch (error) {

          }
          this.guessInfo = res.data;
        }
      })
    }
  },
  watch: {
    // 监听选中游戏改变
    guessId(newVal) {
      this.getGuessInfo();
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
<style scoped>
.el-tag {
  margin: 3px 6px 3px 0;
}
</style>