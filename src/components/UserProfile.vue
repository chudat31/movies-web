<template>
  <h1>THÔNG TIN TÀI KHOẢN</h1>
  <div>
    <article><img :src="userInfo.userImg" alt="" /></article>
    <article>
      <p><strong>Tên đăng nhập: </strong> {{ userInfo.userName }}</p>
      <p><strong>Địa chỉ Email: </strong>{{ userInfo.email }}</p>
      <p><strong>ID nhận dạng: </strong> {{ userInfo.userID }}</p>
      <p><strong>Ngày tạo: </strong> {{ userInfo.dayCreate }}</p>
    </article>
  </div>
</template>

<script>
import { onMounted, reactive } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
export default {
  setup() {
    const userInfo = reactive({
      email: "",
      userName: "",
      userID: "",
      dayCreate: "",
      userImg: "",
    });
    let auth;
    onMounted(() => {
      auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          userInfo.email = user.email;
          userInfo.userName = user.displayName;
          userInfo.userID = user.uid;
          userInfo.dayCreate = user.metadata.creationTime;
          userInfo.userImg = user.photoURL;
        } else {
          return;
        }
      });
    });
    return {
      userInfo,
    };
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
}
div {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
article {
  margin-left: 30px;
}
</style>
