<template>
  <WebHeader />
  <div class="movie-detail">
    <div class="video">
      <iframe
        title=movie.title
        :src="getLink()"
        allowfullscreen
        allow="autoplay"
        frameborder="0"
      ></iframe>
      <!-- <iframe v-else-if="!getLink()" src="video.linkEmbed" frameborder="0"></iframe> -->
      <!-- <img v-else :src="movie.image" alt="" /> -->
    </div>
    <div class="content">
      <h2>{{ movie.title }}</h2>
      <p>
        <strong><i>Released: </i></strong>{{ movie.releaseDate }}
      </p>
      <p class="plot">
        <strong> <i>Plot: </i> </strong>{{ movie.plot }}
      </p>
      <p>
        <strong><i>Actors: </i></strong>{{ movie.stars }}
      </p>
      <p>
        <strong><i>Country: </i></strong>{{ movie.countries }}
      </p>
      <p>
        <strong><i>Genre: </i></strong>{{ movie.genres }}
      </p>
      <!-- <p>
        <strong><i>Companies Production: </i></strong> {{ movie.companies }}
      </p>
      <p>
        <strong><i>Directors: </i></strong> {{ movie.directors }}
      </p> -->
      <p>
        <strong><i>Runtime: </i></strong> {{ movie.runtimeStr }}
      </p>
    </div>
  </div>
  <p>
    <strong><i>Keywords: </i></strong> {{ movie.keywords }}
  </p>
  <h2>DIỄN VIÊN</h2>
  <div class="actor-list">
    <div class="actor-item" v-for="actor in actors" :key="actor.id">
      <div class="actorImg">
        <img :src="actor.image" alt="" />
      </div>
      <div class="actorInfo">
        <p>
          <strong>{{ actor.name }}</strong>
        </p>
      </div>
    </div>
  </div>
  <h2>PHIM LIÊN QUAN</h2>
  <div class="similar-list">
    <div class="similar-item" v-for="similar in similars" :key="similar.id">
      <router-link :to="'/movie/' + similar.id" class="similar-link">
        <div class="poster">
          <img :src="similar.image" alt="" />
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
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "@/api.js";
import axios from "axios";
export default {
  name: "MovieDetail",
  components: { WebHeader, WebFooter },
  setup() {
    const movie = ref({});
    const video = ref({});
    const actors = ref([]);
    const similars = ref([]);
    const route = useRoute();
    onMounted(() => {
      axios
        .get(
          `https://imdb-api.com/en/API/Title/${api.apikey4}/${route.params.id}`
        )
        .then((data) => {
          movie.value = data.data;
        });
    });
    const getLink = () => {
      return "https://www.2embed.ru/embed/imdb/movie?id=" + route.params.id;
    };
    onMounted(() => {
      axios
        .get(
          `https://imdb-api.com/en/API/Trailer/${api.apikey4}/${route.params.id}`
        )
        .then((data) => {
          video.value = data.data;
        });
    });
    onMounted(() => {
      axios
        .get(
          `https://imdb-api.com/en/API/Title/${api.apikey4}/${route.params.id}`
        )
        .then((data) => {
          actors.value = data.data.actorList;
        });
    });
    onMounted(() => {
      axios
        .get(
          `https://imdb-api.com/en/API/Title/${api.apikey4}/${route.params.id}`
        )
        .then((data) => {
          similars.value = data.data.similars;
        });
    });
    return {
      movie,
      getLink,
      video,
      actors,
      similars,
    };
  },
};
</script>

<style scoped>
.movie-detail {
  display: flex;
  justify-content: center;
  /* align-items: center; */
  height: 800px;
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
  width: 855px;
  height: 800px;
  object-fit: cover;
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
.video > img {
  width: 855px;
  height: 800px;
  object-fit: cover;
  margin-right: 50px;
}
/* .plot {
  font-size: 10px;
} */
</style>
