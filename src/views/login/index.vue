<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form clearfix"
      auto-complete="on"
      label-position="left"
    >
      <div class="loginForm-left">
        <img class="ui-img" src="@/assets/login/ui_img.png" />
      </div>

      <div class="loginForm-right">
        <div class="title-container">
          <img class="logo" src="@/assets/login/logo.png" />
          <h3 class="title">缔塔运维自动化平台</h3>
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入用户名"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="pwd">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="pwd"
            v-model="loginForm.pwd"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-form-item prop="code">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            ref="code"
            v-model="loginForm.code"
            placeholder="请输入验证码"
            name="code"
            tabindex="3"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <img :src="captchaSrc" />
        </el-form-item>

        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;margin-bottom:30px;"
          @click.native.prevent="handleLogin"
        >登录</el-button>
      </div>
    </el-form>
    <img class="bg-1" src="@/assets/login/bg_1.png" />
    <img class="bg-2" src="@/assets/login/bg_2.png" />
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { getCaptcha } from '@/api/user'
import md5 from 'js-md5'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位数'))
      } else if (value.indexOf(' ') >= 0) {
        callback(new Error('密码不能包含空格'))
      }else{
        callback()
      }
    }
    return {
      loginForm: {
        username: 'portal',
        pwd: 'Dita@123',
        code: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        pwd: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      loading: false,
      password: 'Dita@123',
      passwordType: 'password',
      redirect: undefined,
      captchaSrc: ''
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    getCaptcha({responseType: 'arraybuffer'}).then((res) => {
      // return 'data:image/png;base64,' + btoa(
      //   new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      // )
      //这里就是将得到的图片流转换成blob类型
      const blob = new Blob([res.data], {
        type: 'application/png;charset=utf-8',
      });
      const url = window.URL.createObjectURL(blob);
      this.captchaSrc = url;
      // this.captchaSrc = 'data:image/jpeg;base64,' + res.data
    })
    // this.captchaSrc = process.env.VUE_APP_BASE_API + '/portal/login!captcha1'
    
  },
  mounted() {},
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.pwd.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.password = this.CalcuMD5(this.loginForm.pwd)
          
          let req = {
            username: this.loginForm.username,
            pwd: this.password,
            code: this.loginForm.code
          }

          console.log(req)
          this.$store
            .dispatch('user/login', req)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    CalcuMD5(pwd) {
      pwd = md5(pwd)
      pwd = pwd.toUpperCase()
      return pwd
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #333;
      height: 47px;
      caret-color: #999;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: #333 !important;
      }
    }
  }

  .el-form-item {
    border-bottom: 1px solid #eee;
    border-radius: 5px;
    color: #454545;
    margin-bottom: 0;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  background-image: linear-gradient(to right, #651e58, #8a62d3);
  overflow: hidden;

  .login-form {
    position: fixed;
    width: 870px;
    height: 510px;
    left: 50%;
    top: 50%;
    margin-top: -255px;
    margin-left: -435px;
    max-width: 100%;
    padding: 70px 60px 0;
    overflow: hidden;
    background: #fff;
    border-radius: 20px;
    z-index: 2;
    box-shadow: 1px 7px 7px 9px rgba(121, 66, 154, 0.3);
    .loginForm-left {
      float: left;
      .ui-img {
        margin: 32px 0 0 -23px;
      }
    }
    .loginForm-right {
      width: 330px;
      float: right;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    .logo {
      margin: 0 auto 20px;
      display: block;
    }

    .title {
      font-size: 30px;
      color: #676767;
      margin: 0px auto 33px auto;
      text-align: center;
      font-weight: normal;
      letter-spacing: 4px;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .svg-icon {
    color: #6a2b6a;
    font-size: 15px;
  }
  .bg-1 {
    position: fixed;
    bottom: 0;
    right: 0;
  }
  .bg-2 {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1;
  }

  .el-button--primary {
    background-image: linear-gradient(to right, #651e58, #8a62d3);
    border: none;
    border-radius: 50px;
    padding: 15px 20px;
    font-size: 18px;
    margin-top: 35px;
    box-shadow: -1px 7px 9px 3px rgba(126, 103, 192, 0.21);
  }
}
</style>
