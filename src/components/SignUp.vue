<template>
  <!-- <web-header /> -->
  <div class="signup">
    <h1>Đăng Ký</h1>
    <form @submit.prevent="submitForm" class="components">
      <div class="component-item">
        <input
          type="email"
          name=""
          id="email"
          placeholder="Email đăng ký"
          v-model="state.email"
        />
        <span v-if="v$.email.$error">
          {{ v$.email.$errors[0].$message }}
        </span>
      </div>
      <div class="component-item">
        <input
          type="text"
          name=""
          id="username"
          placeholder="Tên người sử dụng"
          v-model="state.username"
        />
        <span v-if="v$.username.$error">
          {{ v$.username.$errors[0].$message }}
        </span>
      </div>
      <div class="component-item">
        <input
          type="password"
          id="password"
          placeholder="Mật khẩu"
          v-model="state.password.password"
        />
        <span v-if="v$.password.password.$error">
          {{ v$.password.password.$errors[0].$message }}
        </span>
      </div>
      <!-- <div class="component-item">
        <input
          type="text"
          name=""
          id="img"
          placeholder="Ảnh đại diện"
          v-model="state.imageSrc"
        />
      </div> -->
      <div class="component-item" id="btn">
        <button @click="register" type="submit">Đăng ký</button>
      </div>
      <div class="change-route">
        <span>Bạn đã có tài khoản?</span>
        <span><router-link to="/login">Đăng Nhập</router-link></span>
      </div>
    </form>
  </div>
  <web-footer />
</template>

<script>
import useValidate from "@vuelidate/core";
// import WebHeader from './WebHeader.vue'
import WebFooter from "./WebFooter.vue";
import { required, email, minLength } from "@vuelidate/validators";
import { computed, onMounted, reactive } from "vue";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import router from "@/router";
export default {
  name: "SignUp",
  components: { WebFooter },
  setup() {
    const state = reactive({
      email: "",
      username: "",
      password: {
        password: "",
      },
    }); 
    // SIGN-UP
    const signUpUser = onMounted(()=>{
      fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          userID : state.email,
          title : state.username,
          body: state.password.password
        })
      })
    })
    const register = () => {
      createUserWithEmailAndPassword(
        getAuth(),
        state.email,
        state.password.password
      )
        .then(() => {
          updateProfile(getAuth().currentUser, {
            displayName: state.username,
          });
          router.push("/login");
        })
        .catch((error) => {
          alert(error);
        });
    };

    // CHECK VALIDATION FORM
    const rules = computed(() => {
      return {
        email: { required, email },
        username: { required },
        password: {
          password: { required, minLength: minLength(6) },
        },
      };
    });

    const v$ = useValidate(rules, state);
    //
    return {
      state,
      v$,
      signUpUser,
      register,
    };
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
.signup {
  box-sizing: content-box;
  max-width: 500px;
  border: none;
  border-radius: 10px;
  margin: 0 auto;
  margin-top: 100px;
  background: linear-gradient(to bottom right, rgb(24, 173, 116), #3498db);
}
.signup input {
  padding-left: 15px;
  margin-top: 20px;
  margin-bottom: 20px;
  width: 460px;
  height: 50px;
  border-radius: 5px;
  border: none;
}
#btn {
  padding-bottom: 40px;
  margin-top: 40px;
}
.signup button:hover {
  background-color: rgb(94, 94, 226);
}
.signup button {
  text-align: center;
  font-size: 20px;
  width: 460px;
  height: 50px;
  color: #fff;
  background-color: green;
  border: none;
  border-radius: 5px;
  transition: 0.5s;
}
.signup h1 {
  text-align: center;
  padding-top: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgb(212, 199, 199);
  width: 430px;
  margin: 20px auto;
}
.component-item span {
  color: rgb(180, 32, 32);
}
#checkbox span {
  color: #000;
}
.change-route {
  text-align: center;
  margin-bottom: 30px;
}

</style>
