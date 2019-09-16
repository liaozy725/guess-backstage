<template>
  <div class="login">
    <div class="login-content clearfix">
      <div class="login-left fl">
        <div class="logo-left-text">
          <div class="logo-left-img">
            <img src="../../assets/logo.png" alt />
          </div>
          <div class="logoTitle">竞猜后台</div>
        </div>
      </div>
      <div class="login-right fr">
        <div class="login-title">登录</div>
        <div class="form">
          <el-form ref="formInline" :model="formInline" :rules="ruleInline" autocomplete="off">
            <el-form-item prop="user">
              <div class="form-title">用户名</div>
              <el-input type="text" v-model="formInline.accountLogin" placeholder style="width: 300px" clearable></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <div class="form-title">密码</div>
              <el-input v-model="formInline.accountPassword" placeholder style="width: 300px" type="password" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSubmit()" round style="width: 180px;" class="loginBtn">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import md5 from 'js-md5';
export default {
  data() {
    return {
      loginAccount: "", //账户名字
      pass: "", //密码
      formInline: {
        accountLogin: "",
        accountPassword: ""
      },
      ruleInline: {
        accountLogin: [
          {
            required: true,
            message: "请填写用户名",
            trigger: "blur"
          }
        ],
        accountPassword: [
          {
            required: false,
            message: "请填写密码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    handleSubmit() {
      this.$refs["formInline"].validate(valid => {
        if (valid) {
          this.$http.post("account/login", this.formInline).then(res => {
            if (res.retCode == 0) {
              this.$store.commit("setToken", res.data.token);
              this.$store.commit("setUserInfo", res.data);
              this.$router.replace("/");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss">
.login {
  width: 100%;
  height: 100%; //  min-height:500px;
  min-width: 960px;
  background: #1f2d3d;
  position: relative;
  overflow-x: hidden;

  /*控制X方向的滚动条*/
  .login-content {
    width: 960px;
    height: 480px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    overflow: hidden;

    .login-left {
      width: 480px;
      height: 480px;
      background: url(../../assets/leftBg.png) no-repeat 0 0;
      background-size: cover;
      background-position: center;
      position: relative;

      .logo-left-text {
        margin: 173px auto 0;
        width: 192px;

        .logo-left-img img {
          display: block;
          margin: 0 auto;
          width: 200px;
        }

        .logoTitle {
          font-size: 24px;
          color: #274a78;
          letter-spacing: 0;
          text-align: center;
          margin-top: 32px;
        }
      }
    }

    .login-right {
      width: 480px;
      height: 480px;
      background: #fff;

      .login-title {
        font-size: 24px;
        color: #5aa6ff;
        letter-spacing: 0;
        text-align: center;
        margin: 50px 0;
      }

      .form {
        margin: 0 90px;

        .login-list {
          margin-top: 30px;

          .form-title {
            margin-bottom: 10px;
            font-size: 14px;
            color: #4a4a4a;
            letter-spacing: 0;
            text-align: left;
          }
        }

        .loginBtn {
          margin: 50px 0 0 60px;
        }
      }
    }
  }
}
</style>
