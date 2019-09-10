<template>
  <div class="add-guess">
    <el-dialog :visible.sync="visible1" title="添加竞猜" center top="10vh">
      <el-form :model="formData" :rules="callRules" ref="call" label-width="90px" class="demo-dynamic">
        <el-form-item prop="memo" label="游戏">
          <el-input placeholder="请输入标题" readonly v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item prop="memo" label="比赛标题">
          <el-input placeholder="请输入比赛标题" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item prop="memo" label="比赛时间">
          <el-date-picker v-model="formData.date" type="datetime" placeholder="选择比赛日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item prop="memo" label="局数">
          <el-input placeholder="请输入局数" type="number" v-model="formData.name"></el-input>
        </el-form-item>
        <!-- 循环 -->
        <el-form-item prop="memo" label="队伍">
          <el-select v-model="formData.game" style="width:100%" placeholder="请选择游戏">
            <el-option label="DOTA2" value="DOTA2"></el-option>
            <el-option label="英雄联盟" value="英雄联盟"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible1=false;">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="nextStep()">下一步</el-button>
      </span>
    </el-dialog>

    <!-- 第二步 -->
    <el-dialog :visible.sync="visible2" title="添加竞猜" center top="10vh" width="1000px">
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

        <!-- 单场竞猜 -->
        <div class="guess-list" v-else>
          <!-- 循环 这个 -->
          <el-card class="list-box">
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
        <el-button @click="visible1=true;visible2=false;">上一步</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submit()">完成</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible1: false,
      visible2: true,
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
    nextStep() {
      this.visible1 = false;
      this.visible2 = true;
    },
    submit() {

    },
    handleTabClick() {

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
                width: 120px;
              }
            }
            &:nth-child(1),&:nth-child(2){
              border-top: 0;
            }
          }
        }
      }
    }
  }
}
</style>