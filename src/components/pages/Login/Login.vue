<template>
  <div class="bg">
    <div class="flex-container">
      <div class="login">
        <!-- <h1>超市进销存管理系统</h1> -->
        <el-tabs v-model="activeName" class="tabs">
          <el-tab-pane label="登录" name="login">
            <el-form
              v-if="activeName == 'login'"
              :model="loginForm"
              :rules="rules"
              ref="loginForm"
            >
              <el-form-item label="用户名" prop="username" label-width="80px">
                <el-input
                  placeholder="请输入用户名"
                  v-model="loginForm.username"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password" label-width="80px">
                <el-input
                  placeholder="请输入密码"
                  v-model="loginForm.password"
                  clearable
                  type="password"
                ></el-input>
              </el-form-item>
              <el-form-item label-width="80px">
                <el-button type="primary" @click="submitForm('loginForm')"
                  >登录</el-button
                >
                <el-button @click="clearForm('loginForm')">重置</el-button>
              </el-form-item>
              <el-form-item label-width="30px">
                <span>管理员账号：admin1，密码：admin1</span>
              </el-form-item>
              <el-form-item label-width="30px">
                <span>用户账号：editor1，密码：editor1</span>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="注册" name="register">
            <register v-if="activeName == 'register'"></register>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import CryptoJS from "crypto-js";
import { login } from "@/api/login.js";
import Register from "./Register.vue";
export default {
  data() {
    return {
      rules: {
        //验证规则
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20个字符",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20个字符",
            trigger: "blur"
          }
        ]
      },
      loginForm: {
        username: "",
        password: ""
      },
      activeName: "login"
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            username: this.loginForm.username,
            password: CryptoJS.MD5(this.loginForm.password).toString()
          };
          login(params).then(res => {
            console.log(res)
            if (res.status) {
              this.$store.dispatch("userLogin", res.data);
              this.$router.push("/home");
            }
          });
        }else{
          return false;
        }
      });
    },
    clearForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  components: {
    Register
  }
};
</script>

<style>
.bg {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: #0f2540;
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-container {
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  margin: 0 auto;
  border-radius: 5px;
}

.login {
  width: 300px;
  height: 380px;
}
</style>
