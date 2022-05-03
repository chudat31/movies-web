<template>
  <WebHeader />
  <div class="movie-detail">
    <div class="video">
      <iframe
        title="movie.title"
        :src="getLink()"
        allowfullscreen
        allow="autoplay"
        frameborder="0"
      ></iframe>
    </div>
    <div class="content">
      <h2>{{ movie.title }}</h2>
      <p>
        <strong><i>Released: </i></strong>{{ movie.release_date }}
      </p>
      <p>
        <strong><i>Homepage: </i></strong>{{ movie.homepage }}
      </p>
      <p>
        <strong><i>Country: </i></strong>{{ countries.name }}
      </p>
      <p>
        <strong><i>Companies Production: </i></strong> {{ companies.name }}
      </p>
      <p>
        <strong><i>Runtime: </i></strong> {{ movie.runtime }} (minutes)
      </p>
      <div>
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-heart"
            viewBox="0 0 16 16"
          >
            <path
              d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"
            />
          </svg>
          Favourite
        </button>
        <button id="btnDel" v-if="isAdmin">Delete Film</button>
      </div>
    </div>
  </div>
  <p>
    <strong><i>Keywords: </i></strong> {{ movie.tagline }}
  </p>
  <p class="plot">
    <strong> <i>Plot: </i> </strong>{{ movie.overview }}
  </p>

  <div class="comment">
    <input type="text" v-model="comment" placeholder="Your comment">
    <button @click="sendComment">Send</button>
    <!-- <span v-if="isCommented">Comment Successfully</span> -->
  </div>
  <div class="all_comments">
    <ul v-for="comment in allComments" :key="comment.id">
      <li>{{comment.comment}}}</li>
    </ul>
  </div>
  <h2>DIỄN VIÊN</h2>
  <div class="actor-list">
    <div class="actor-item" v-for="actor in actors" :key="actor.id">
      <router-link :to="'/actor/' + actor.id">
        <div class="actorImg">
        <img :src="'https://image.tmdb.org/t/p/w500' + actor.profile_path" alt="" />
      </div>
      <div class="actorInfo">
        <p>
          <strong>{{ actor.name }}</strong>
        </p>
      </div>
      </router-link>
    </div>
  </div>
  <h2>PHIM LIÊN QUAN</h2>
  <div class="similar-list">
    <div class="similar-item" v-for="similar in similars" :key="similar.id">
      <router-link :to="'/movie/' + similar.id" class="similar-link">
        <div class="poster">
          <img :src="'https://image.tmdb.org/t/p/w500' + similar.poster_path" alt="" />
        </div>
        <div class="similarInfo">
          <p class="title">
            <strong>{{ similar.title }}</strong>
          </p>
        </div>
      </router-link>
    </div>
  </div>
  <WebFooter />
</template>

<script>
import WebHeader from "./WebHeader.vue";
import WebFooter from "./WebFooter.vue";
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
// import api from "@/api.js";
import axios from "axios";
import {getAuth, onAuthStateChanged} from 'firebase/auth'
export default {
  name: "MovieDetail",
  components: { WebHeader, WebFooter },
  setup() {
    const name = ref()
    const favourite = ref()
    const movie = ref({})
    const genres = ref([])
    const video = ref({})
    const actors = ref([])
    const similars = ref([])
    const isAdmin = ref(false)
    const comment = ref('')
    const isCommented = ref(false)
    const allComments = ref([])
    const countries = ref([])
    const companies = ref([])
    const imdb_id = ref('')
    const route = useRoute();
    //Kiểm tra quyền ADMIN
    let auth;
    onMounted(() => {
      auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          if (user.email === 'admin@gmail.com') {
            isAdmin.value = true;
          }
        } else {
          return;
        }
      });
    });

    //Lấy dữ liệu comment của phim
    onMounted( async() => {
      allComments.value = await axios.get('')
    })

    //Gửi comment
    const sendComment = onMounted(()=>{
      fetch('', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          comment: comment.value
        })
      })
      .then(() => {
        isCommented.value = true;
      })
      .catch(() => {
        isCommented.value = false;
      })
    })

    //Lấy dữ liệu phim từ API
    const title = onMounted( async() => {
      const data = await axios.get(
          `https://api.themoviedb.org/3/movie/${route.params.id}?api_key=73b750a9c1721e4bce1ae7fc3a32c1a2`
        )
      movie.value = data.data
      imdb_id.value = data.data.imdb_id;
      countries.value = data.data.production_countries[0];
      companies.value = data.data.production_companies[0];
    });

    //Lấy link phim
    const getLink = () => {
      return "https://www.2embed.ru/embed/imdb/movie?id=" + imdb_id.value;
    };

    //Lấy dữ liệu về diễn viên
    const actor = onMounted(() => {
      axios
        .get(
          `https://api.themoviedb.org/3/movie/${route.params.id}/credits?api_key=73b750a9c1721e4bce1ae7fc3a32c1a2&`
        )
        .then((data) => {
          actors.value = data.data.cast;
        });
    });

    //Lấy dữ liệu các phim liên quan
    const similiars = onMounted(() => {
      axios
        .get(
          `https://api.themoviedb.org/3/movie/${route.params.id}/similar?api_key=73b750a9c1721e4bce1ae7fc3a32c1a2`
        )
        .then((data) => {
          similars.value = data.data.results;
        });
    });
    watch(route,()=>{
      similiars();
      actor();
      title();
    })
    return {
      name,
      favourite,
      movie, companies,
      genres, countries,
      getLink,
      video,
      actors,
      similars,
      isAdmin,
      comment, 
      isCommented,
      allComments,
      sendComment,
      title
    };
  },
};
</script>

<style scoped>
.movie-detail {
  display: flex;
  /* justify-content: center; */
  /* align-items: center; */
  height: 550px;
  padding-right: 20px;
  margin-bottom: 20px;
  margin-top: 100px;
  background: linear-gradient(
    to bottom right,
    rgb(184, 39, 39),
    rgb(228, 214, 227)
  );
}
iframe {
  width: 755px;
  height: 550px;
  margin-right: 50px;
}
.content p {
  font-weight: 500;
}
.content {
  margin-top: -40px;
  text-shadow: 2px 2px 10px gray;
}
.actor-list {
  display: flex;
  flex-wrap: wrap;
}
.actor-item {
  margin: 7px;
}
.actorImg > img {
  width: 305px;
  height: 400px;
  border-radius: 5px;
}
h2 {
  margin-bottom: 30px;
  margin-top: 100px;
}
.similar-list {
  display: flex;
  flex-wrap: wrap;
}
.similar-item {
  margin: 3px;
}
.poster > img {
  width: 250px;
  height: 380px;
}
.similarInfo {
  width: 250px;
}
.similar-link {
  text-decoration: none;
  color: #000;
}
.title {
  color: red;
}
.content strong {
  color: rgb(7, 35, 161);
  text-decoration: underline;
}
.content button {
  margin-top: 20px;
  border: 0.5px solid rgb(51, 47, 47);
  border-radius: 5px;
  padding: 10px;
  background-color: rgb(212, 159, 60);
  color: black;
}
svg {
  margin-right: 5px;
}
#btnDel {
  margin-left: 10px;
}
/* .plot {
  font-size: 10px;
} */
</style>
