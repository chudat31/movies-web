<template>
  <web-header />
  <div class="actor">
    <h5>THÔNG TIN DIỄN VIÊN</h5>
    <div class="info__img">
      <img
        :src="'https://image.tmdb.org/t/p/w500' + actor.profile_path"
        alt=""
      />
      <div class="info">
        <p><strong>Name: </strong>{{ actor.name }}</p>
        <p><strong>Birthday: </strong>{{ actor.birthday }}</p>
        <p><strong>Biography: </strong>{{ actor.biography }}</p>
        <p><strong>Place Of Birth: </strong>{{ actor.place_of_birth }}</p>
        <p><strong>Known as: </strong>{{ actor.known_for_department }}</p>
      </div>
    </div>
    <h5>PHIM LIÊN QUAN</h5>
    <div class="movies">
        <div v-for="movie in movies" :key="movie.id" class="list__films">
            <router-link v-if="movie.poster_path !== null" :to="'/movie/' + movie.id" class="each__film">
               <img :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" alt="">
               <p>{{movie.title}}</p>
            </router-link>
        </div>
    </div>
  </div>
  <web-footer />
</template>

<script>
import WebHeader from "./WebHeader.vue";
import WebFooter from "./WebFooter.vue";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
export default {
  components: { WebHeader, WebFooter },
  setup() {
    const route = useRoute();
    const actor = ref([]);
    const movies = ref([]);
    onMounted(async () => {
      const data = await axios.get(
        `https://api.themoviedb.org/3/person/${route.params.id}?api_key=73b750a9c1721e4bce1ae7fc3a32c1a2&language=en-US`
      );
      actor.value = data.data;
    });
    onMounted(async () => {
      const data = await axios.get(
        `https://api.themoviedb.org/3/person/${route.params.id}/movie_credits?api_key=73b750a9c1721e4bce1ae7fc3a32c1a2&language=en-US`
      );
      movies.value = data.data.cast;
    });

    return {
      actor,
      movies,
    };
  },
};
</script>

<style scoped>
.actor {
  margin: 50px;
}
.info__img {
  display: flex;
  margin-bottom: 60px;
}
h5 {
    margin-top: 30px;
    margin-bottom: 30px;
}
.info {
  margin-left: 30px;
}
.movies {
    display: flex;
    flex-wrap: wrap; 
}
.list__films {
    margin-right: 10px;
}
.each__film img {
    width: 280px;
}
.each__film p {
    width: 200px;
}
a {
    text-decoration: none;
    text-transform: uppercase;
    font-size: 1rem;
    font-weight: 500;
}
</style>
