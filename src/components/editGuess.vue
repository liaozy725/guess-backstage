<template>
  <div class="add-guess">
    <!-- 第二步 -->
    <el-dialog :visible.sync="visible" title="添加竞猜" center top="6vh" width="1200px" :before-close="beforeClose" :close-on-click-modal="false">
      <el-row :gutter="20">
        <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8" class="flex-item">
          <label class="tit">游戏:</label>
          <span>{{guessInfo.gameName}}</span>
        </el-col>
        <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8" class="flex-item">
          <label class="tit">比赛时间:</label>
          <span>{{guessInfo.matchTime | parseTime}}</span>
        </el-col>
        <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8" class="flex-item">
          <label class="tit">赛事:</label>
          <span>{{guessInfo.matchName}}</span>
        </el-col>
        <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8" class="flex-item">
          <label class="tit">比赛名称:</label>
          <span>{{guessInfo.name}}</span>
        </el-col>
        <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8" class="flex-item">
          <label class="tit">局数:</label>
          <span>{{guessInfo.number}}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="flex-item">
          <label class="tit">战队:</label>
          <span>
            <el-tag class="team-tag" v-for="(value,key,index) in guessInfo.team">{{value}}</el-tag>
          </span>
        </el-col>
      </el-row>
      <el-card class="guess-list-container" shadow="never">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane label="总竞猜" name="all"></el-tab-pane>
          <el-tab-pane v-for="tab in guessInfo.number" :label="'第'+tab+'局'" :name="tab+''"></el-tab-pane>
        </el-tabs>
        <!-- 总竞猜 -->
        <div class="guess-list" ref="guessList" :style="{height:'50vh',overflow:'auto'}">
          <!-- 循环 这个 -->
          <el-card class="list-box" v-for="item in guessInfo.guessInfoReps">
            <el-table :data="[item]">
              <el-table-column prop="title" label="标题" header-align="center" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.title}}</span>
                  <span v-if="activeTab=='all'"> (第{{scope.row.number}}局)</span>
                </template>
              </el-table-column>
              <el-table-column prop="guessType" label="类型" header-align="center" align="center"></el-table-column>
              <el-table-column prop="guessPrice" label="初始资金池" header-align="center" align="center"></el-table-column>
              <el-table-column prop="bonusPrice" label="总奖金池" header-align="center" align="center"></el-table-column>
              <el-table-column prop="percentage" label="抽成" header-align="center" align="center"></el-table-column>
              <el-table-column prop="headImage" label="玩法" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.playType" :disabled="item.isSealed=='y'" placeholder="选择玩法">
                    <el-option label="滚盘" :value="1"></el-option>
                    <el-option label="早盘" :value="2"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" header-align="center" width="210" align="center">
                <template slot-scope="scope">
                  <el-button size="small" @click="deleteGuessItem(item)" v-if="item.isSealed.includes('n')">删除</el-button>
                  <el-button size="small" type="warning" @click="saveGuessItem(item,'n')" v-if="item.isSealed.includes('n')">保存</el-button>
                  <el-button size="small" type="danger" @click="saveGuessItem(item,'y')" v-if="item.isSealed.includes('n')">封盘</el-button>
                  <el-button size="small" type="primary" @click="jiesuan(item)" v-if="!item.isSealed.includes('n') && item.matchResult == 2">结算</el-button>
                  <el-tag effect="plain" type="primary" v-if="!item.isSealed.includes('n') && item.matchResult == 1">已结算</el-tag>
                </template>
              </el-table-column>
            </el-table>
            <el-row :gutter="20" class="card-item-list">
              <el-col v-for="(ele,idx) in item.details" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                <span class="item-l">{{ele.teamName}}</span>
                <div class="item-r">
                  <label>赔率：</label>
                  <el-input v-model="ele.odd" :disabled="item.isSealed=='y'" type="number" clearable placeholder="赔率"></el-input>
                  <span>￥{{ele.price}}</span>
                </div>
                <div class="item-btns">
                  <el-button size="small" v-if="!item.isSealed.includes('n') && !item.reamrk" type="success" round @click="updateGuessWin(item,ele)">胜利</el-button>
                  <el-tag effect="plain" type="success" v-if="!item.isSealed.includes('n') && item.reamrk==ele.teamId">胜利</el-tag>
                  <i class="iconfont icon-jiesuo" v-if="ele.isSealed != 'y'" @click="toggleLock(item,ele,'y')"></i>
                  <i class="iconfont icon-suo" v-else></i>
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
      activeTab: 'all', // 获取第几局数据
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
    handleTabClick(e) {
      this.activeTab = e.name;
      this.getGuessInfo();
      this.$refs['guessList'].scrollTop = 0;
    },
    // 获取竞猜详情
    getGuessInfo() {
      let params = {
        token: this.$store.state.user.token,
        guessId: this.guessId,
        number: this.activeTab == 'all' ? '' : this.activeTab
      }
      this.$http.post('guess/info', params).then(res => {
        if (res.retCode == 0) {
          res.data.team = JSON.parse(res.data.team)
          res.data.guessInfoReps.forEach(ele => {
            ele.details = initJSON(ele.isSealed, ele.newGuessPrice, ele.odds, res.data.team)
          });
          this.guessInfo = res.data;
        }
      })
      // 解析JSON数据，并做处理
      function initJSON(isSealedJSON, newGuessPriceJSON, oddsJSON, teamObj) {
        let sealed = JSON.parse(isSealedJSON);
        let guessPrice = JSON.parse(newGuessPriceJSON);
        let odds = JSON.parse(oddsJSON);
        let returnArr = [];
        for (let key in odds) {
          returnArr.push({
            teamId: key,
            teamName: teamObj[key],
            odd: odds[key],
            isSealed: sealed[key],
            price: guessPrice[key]
          })
        }
        return returnArr;
      }
    },
    // 保存竞猜修改
    saveGuessItem(item,flag) {
      let params = {
        token: this.$store.state.user.token,
        guessInfoId: item.id,
       
      };
      let ids = [], odds = [], isSealed = [];
      item.details.forEach(ele => {
        ids.push(ele.teamId);
        odds.push(ele.odd);
        isSealed.push(ele.isSealed);
      });
      params.gameTeamIds = ids.join();
      if(flag != 'y'){
        params.guessPrice= item.guessPrice;
        params.percentage=item.percentage;
        params.playType=item.playTyp;
        params.odds = odds.join();
        params.isSealed = isSealed.join();
        if(params.odds.includes('0')){
          return this.$message({ showClose: true, message: "请填写正确赔率", type: "error" });
        }
      }else{
        params.isSealed = 'all'
      }
      
      this.$http.post('guess/update', params).then(res => {
        if (res.retCode == 0) {
          this.$message({ showClose: true, message: "操作成功", type: "success" });
          this.getGuessInfo();
        }
      })
    },
    // 锁定 / 解锁 
    toggleLock(item, guess) {
      let params = {
        token: this.$store.state.user.token,
        guessInfoId: item.id,
        isSealed: 'y',
        gameTeamIds: guess.teamId
      }
      this.$http.post('guess/update', params).then(res => {
        if (res.retCode == 0) {
          this.$message({ showClose: true, message: "操作成功", type: "success" });
          this.getGuessInfo();
        }
      })
    },
    // 删除竞猜
    deleteGuessItem(item) {
      this.$confirm("此操作将永久删除此条竞猜, 是否继续?", "提示").then(() => {
        let params = {
          token: this.$store.state.user.token,
          id: item.id
        }
        this.$http.post('guess/guessDel', params).then(res => {
          if (res.retCode == 0) {
            this.getGuessInfo();
            this.$message({ showClose: true, message: "操作成功", type: "success" });
          }
        })
      }).catch(() => {

      })
    },
    // 竞猜胜负 设置胜利队伍
    updateGuessWin(guess, team) {
      this.$confirm(`此操作将设置${team.teamName}为胜利, 是否继续?`, "提示").then(() => {
        let params = {
          token: this.$store.state.user.token,
          guessInfoId: guess.id,
          gameTeamId: team.teamId
        }
        this.$http.post('guess/updateGuessWin', params).then(res => {
          if (res.retCode == 0) {
            this.getGuessInfo();
            this.$message({ showClose: true, message: "操作成功", type: "success" });
          }
        })
      }).catch(() => {

      })
    },
    // 结算
    jiesuan(item) {
      this.$confirm("此操作将结算此竞猜, 是否继续?", "提示").then(() => {
        let params = {
          token: this.$store.state.user.token,
          guessInfoId: item.id
        }
        this.$http.post('guess/jiesuan', params).then(res => {
          if (res.retCode == 0) {
            this.getGuessInfo();
            this.$message({ showClose: true, message: "操作成功", type: "success" });
          }
        })
      }).catch(() => {

      })
      
    }
  },
  watch: {
    // 监听选中游戏改变
    guessId(newVal) {
      if (newVal) {
        this.getGuessInfo();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/variables.scss";
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
            padding-left: 0 !important;
            padding-right: 0 !important;
            border-top: 1px solid #999;
            .item-l {
              flex: 0 0 90px;
              height: 40px;
              vertical-align: middle;
              line-height: 40px;
              display: inline-block;
              padding-left: 10px;
            }
            .item-r {
              flex: 1;
              .el-input {
                width: 90px;
              }
              span {
                font-size: 14px;
                display: inline-block;
                width: 190px;
                text-align: center;
              }
            }
            .item-btns {
              width: 100px;
              .iconfont {
                margin-left: 10px;
                font-size: 24px;
                color: $defaultBule;
                vertical-align: middle;
                cursor: pointer;
              }
              .icon-suo{
                color: $blue;
                cursor: not-allowed;
              }
            }
            &:nth-child(2n) .item-l {
              border-left: 1px solid #ccc;
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