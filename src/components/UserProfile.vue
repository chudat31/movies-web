<template>
  <h1>THÔNG TIN TÀI KHOẢN</h1>
  <div>
    <article id="one">
      <img :src="userInfo.userImg" alt="" />
      <br />
      <br />
      <br />
      <h3>
        <i style="color: blue"
          >Thay đổi ảnh đại diện</i
        >
      </h3>
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
      <br>
      <button @click="onUploadFile">Tải lên</button>
    </article>
    <article id="two">
      <p><strong>Tên đăng nhập: </strong> {{ userInfo.userName }}</p>
      <p><strong>Địa chỉ Email: </strong>{{ userInfo.email }}</p>
      <p><strong>ID nhận dạng: </strong> {{ userInfo.userID }}</p>
      <p><strong>Ngày tạo: </strong> {{ userInfo.dayCreate }}</p>
      <p>
        <strong>Lần đăng nhập gần nhất: </strong> {{ userInfo.lastDaySignIn }}
      </p>
    </article>
  </div>
</template>

<script>
import {
  getStorage,
  ref as stRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
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
      fileRef: "",
      selectedFile: null,
    });

    // UPLOAD FILE AND GET URL FROM STORAGE
    const storage = getStorage();
    const database = getDatabase();
    const databaseRef = dbRef(database);

    async function onchangeFile(event) {
      userInfo.selectedFile = event.target.files[0];
      if (userInfo.selectedFile) {
        userInfo.fileRef = stRef(storage, userInfo.selectedFile.name);
        uploadBytes(userInfo.fileRef, userInfo.selectedFile).then((data) => {
          console.log(data);
          const newFile = push(databaseRef);
          set(newFile, {
            name: userInfo.selectedFile.name,
          });
        });
      }
    }
    async function onUploadFile() {
      //DOWNLOAD FILE
      getDownloadURL(userInfo.fileRef).then((url) => {
        console.log(url);
        updateProfile(getAuth().currentUser, { photoURL: url });
      });
    }

    // NEU DANG NHAP THANH CONG LAY THONG TIN VE TAI KHOAN
    let auth;
    onMounted(() => {
      auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          userInfo.email = user.email;
          userInfo.userName = user.displayName;
          userInfo.userID = user.uid;
          userInfo.dayCreate = user.metadata.creationTime;
          userInfo.lastDaySignIn = user.metadata.lastSignInTime;
          userInfo.userImg = user.photoURL;
        } else {
          return;
        }
      });
    });
    return {
      userInfo,
      onchangeFile,
      onUploadFile,
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
  margin-top: 30px;
}
article {
  margin-left: 30px;
}
span {
  font-size: 12px;
  color: black;
}
#one {
  width: 300px;
}
strong {
  text-decoration: underline;
}
</style>
