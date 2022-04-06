<template>
  <web-header />
  <div class="login">
    <h1>Đăng Nhập</h1>
    <form @submit.prevent="submitForm" class="components">
      <div class="component-item">
        <input
          type="text"
          name=""
          id="email"
          placeholder="Email đăng nhập"
          v-model="state.email"
        />
        <span v-if="v$.email.$error">
          {{ v$.email.$errors[0].$message }}
        </span>
      </div>
      <div class="component-item">
        <input
          type="password"
          id="password"
          placeholder="Mật khẩu"
          v-model="state.password"
        />
        <span v-if="v$.password.$error">
          {{ v$.password.$errors[0].$message }}
        </span>
      </div>
      <p v-if="errMsg">{{ errMsg }}</p>
      <div class="component-item" id="btn">
        <button @click="login" type="submit">Đăng nhập</button>
      </div>
      <div class="change-route">
        <span>Bạn chưa có tài khoản?</span>
        <span><router-link to="/signup">Đăng Ký</router-link></span>
      </div>
    </form>
  </div>
  <web-footer />
</template>

<script>

import useValidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import { computed, reactive, ref} from 'vue'
import WebHeader from "./WebHeader.vue";
import WebFooter from "./WebFooter.vue";
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import router from '@/router';
export default {
  components: {
    WebHeader,
    WebFooter,
  },
  setup() {
    const state = reactive({
      email: "",
      password: {
        password: "",
      }
    })
    const errMsg = ref();

    const login = () => {
      signInWithEmailAndPassword(getAuth(), state.email, state.password)
      .then(() => {
        alert("Login Succesfully");
        router.push("/search");
      })
      .catch((error) => {
        switch(error.code) {
          case "auth/invalid-email" :
            errMsg.value = "Invalid email";
            break;
          case "auth/user-not-found" :
            errMsg.value = "No account with that email was found";
            break;
          case "auth/wrong-password" :
            errMsg.value = "Incorrect password";
            break;
          default:
            errMsg.value = "Email or password was incorrect"
            break;
        }
      })
    }

    const rules = computed(() => {
      return {
        email: { required, email },
        password: {
          password: required,
          minLength: minLength(6),
        }
      }
    })

    const v$ = useValidate(rules, state)
    return {
      state,
      v$,
      login,
      errMsg
    }
  },
  methods: {
    submitForm() {
      this.v$.$validate();
    },
  },
};
</script>
<style scoped>
label {
  font-size: 20px;
}
.components {
  display: flex;
  flex-direction: column;
  border-top: 2px;
  padding-left: 20px;
}
.login {
  box-sizing: content-box;
  max-width: 500px;
  border: none;
  border-radius: 10px;
  margin: 0 auto;
  margin-top: 100px;
  background: linear-gradient(to bottom right, rgb(223, 119, 209), #1cd1d1);
}
.login input {
  padding-left: 15px;
  margin-top: 20px;
  margin-bottom: 40px;
  width: 460px;
  height: 50px;
  border-radius: 5px;
  border: none;
}
.login button:hover {
  background-color: rgb(58, 190, 58);
}
#btn {
  padding-top: 20px;
  padding-bottom: 40px;
}
.login button {
  text-align: center;
  font-size: 20px;
  width: 460px;
  height: 50px;
  color: #fff;
  background-color: rgb(51, 72, 190);
  border: none;
  border-radius: 5px;
  transition: 0.5s;
}
.login h1 {
  color: #000;
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
  text-align: center;
  padding-top: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgb(212, 199, 199);
  width: 430px;
  margin: 20px auto;
}
.change-route {
  margin-bottom: 30px;
  text-align: center;
}
.component-item span {
  color: rgb(180, 32, 32);
}
p {
   color: rgb(180, 32, 32);
   text-align: center;
   text-transform: uppercase;
   font-weight: 500;
}
</style>
