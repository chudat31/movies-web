<template>
  <h1>THÔNG TIN TÀI KHOẢN</h1>
  <div>
    <article>
      <img :src="userInfo.userImg" alt="" />
      <br> <br> <br>
      <h3><i style="color:blue,">Thay đổi ảnh đại diện</i></h3>
      <div class="component-item">
        <input
          type="file"
          name=""
          id="imgSrc"
          accept="image/*"
          placeholder="Ảnh đại diện"
          @change="onchangeFile"
        />
      </div>
    </article>
    <article>
      <p><strong>Tên đăng nhập: </strong> {{ userInfo.userName }}</p>
      <p><strong>Địa chỉ Email: </strong>{{ userInfo.email }}</p>
      <p><strong>ID nhận dạng: </strong> {{ userInfo.userID }}</p>
      <p><strong>Ngày tạo: </strong> {{ userInfo.dayCreate }}</p>
      <p><strong>Lần đăng nhập gần nhất: </strong> {{ userInfo.lastDaySignIn }}</p>
    </article>
  </div>
</template>

<script>
import { getStorage, ref as stRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, push, set } from "firebase/database";
import { onMounted, reactive } from "vue";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
export default {
  setup() {
    const userInfo = reactive({
      email: "",
      userName: "",
      userID: "",
      dayCreate: "",
      lastDaySignIn: "",
      userImg: "",
    });
    const currentUser = getAuth().currentUser;
    const storage = getStorage();
    const database = getDatabase();
    const databaseRef = dbRef(database);

    async function onchangeFile(event) {
      const file = event.target.files[0];
      if (file) {
        const fileRef = stRef(storage, file.name);
        uploadBytes(fileRef, file)
        .then(() => {
          const newFile = push(databaseRef);
          set(newFile, {
            name: file.name,
          });
        });
        getDownloadURL(fileRef)
        .then((url)=>{
          console.log(url);
          updateProfile(currentUser, {photoURL: url});
        })
        
      }
    }
    let auth;
    onMounted(() => {
      auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          userInfo.email = user.email;
          userInfo.userName = user.displayName;
          userInfo.userID = user.uid;
          userInfo.dayCreate = user.metadata.creationTime;
          userInfo.lastDaySignIn = user.metadata.lastSignInTime
          userInfo.userImg = user.photoURL;
        } else {
          return;
        }
      });
    });
    return {
      userInfo,
      onchangeFile
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
