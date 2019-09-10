<template>
  <div class="add-guess">
    <el-dialog :visible.sync="visible" title="操作竞猜" center top="10vh" width="1000px" :before-close="beforeClose">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="flex-item">
          <label class="tit">游戏:</label>
          <span>英雄联盟</span>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="flex-item">
          <label class="tit">比赛时间:</label>
          <span>2019-12-28 14:30</span>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="flex-item">
          <label class="tit">赛事:</label>
          <span>2019全球总决赛</span>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="flex-item">
          <label class="tit">比赛名称:</label>
          <span>4进2</span>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="flex-item">
          <label class="tit">局数:</label>
          <span>5</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="flex-item">
          <label class="tit">队伍1:</label>
          <span>RNG</span>
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
        <div class="guess-list" v-if="activeTab == 'first'">
          <!-- 循环 这个 -->
          <el-card class="list-box">
            <el-table :data="tableData">
              <el-table-column prop="headImage" label="标题" header-align="center" align="center"></el-table-column>
              <el-table-column prop="headImage" label="类型" header-align="center" align="center"></el-table-column>
              <el-table-column prop="headImage" label="默认资金池" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.money" disabled type="number" placeholder="默认奖金池"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="headImage" label="抽成" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.money" disabled type="number" placeholder="抽成">
                    <template slot="append">%</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="headImage" label="玩法" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.money" disabled placeholder="选择玩法">
                    <el-option label="滚盘" value="滚盘"></el-option>
                    <el-option label="早盘" value="早盘"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" header-align="center" width="80" align="center">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="settlement()">结算</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row :gutter="20" class="card-item-list">
              <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                <span class="item-l">RNG</span>
                <div class="item-r">
                  <label>赔率：</label>
                  <el-input v-model="formData.game" type="number" clearable placeholder="赔率"></el-input>
                  <span class="money">345USDT</span>
                </div>
                <div class="locks">
                  <el-button size="mini" type="success" round>胜利</el-button>
                  <!-- <i class="iconfont icon-suo"></i> -->
                  <i class="iconfont icon-jiesuo"></i>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-card>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="visible=false">取消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submit()">完成</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
export default {
  props:{
    visible:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      btnLoading: false,
      callRules: {
        name: [{ required: true, message: '请输入战队名称', trigger: 'change' }],
        teamNun: [{ required: true, message: '请输入战队数', trigger: 'change' }]
      },
      formData: {
        game: '',
        name: '',
        teamNun: ''
      },
      activeTab: 'first',
      tableData: [1],
    }
  },
  methods: {
    // 结算
    settlement(){
      this.$emit("handleClose",false);
    },
    handleTabClick(e) {

    },
    // 弹窗关闭前
    beforeClose(){
      this.$emit("handleClose",false);
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
              flex: 0 0 80px;
            }
            .item-r {
              flex: 1;
              .el-input {
                width: 100px;
              }
              .money {
                width: 100px;
                display: inline-block;
                text-align: center;
              }
            }
            .locks {
              width: 100px;
              padding-right: 10px;
              line-height: 40px;
              height: 40px;
              text-align: right;
              .iconfont {
                font-size: 24px;
                cursor: not-allowed;
                vertical-align: middle;
                margin-left: 4px;
                &.icon-jiesuo {
                  color: #409eff;
                  cursor: pointer;
                }
              }
            }
            &:nth-child(2n + 1) .locks {
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