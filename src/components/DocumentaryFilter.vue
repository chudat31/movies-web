<template>
  <WebHeader />
  <h2>PHIM TÀI LIỆU</h2>
  <div class="popular-film">
    <div class="movie-item" v-for="movie in movies" :key="movie.id">
      <router-link :to="'/movie/' + movie.id" class="movie-link">
        <div class="poster">
          <img :src=" 'https://image.tmdb.org/t/p/w500' + movie.poster_path" alt="" />
          <p class="rank"><strong>DOCUMENTARY</strong></p>
        </div>
        <div class="detail">
          <p><strong>{{movie.title}}</strong></p>
          <p><strong>Năm Phát Hành: </strong>{{movie.release_date}}</p>
        </div>
      </router-link>
    </div>
  </div>
  <WebFooter />
</template>

<script>
import axios from "axios";
import WebHeader from './WebHeader';
import WebFooter from './WebFooter';
// import api from "@/api.js";
export default {
  name: "AdventureFilter",
  components: {WebHeader, WebFooter},
  data() {
    return {
      movies: [],
    };
  },
  methods: {
    getData() {
      axios
        .get(`https://api.themoviedb.org/3/discover/movie?api_key=73b750a9c1721e4bce1ae7fc3a32c1a2&with_genres=99`)
        .then((data) => {
          this.movies=data.data.results
        });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style scoped>
.popular-film {
    display: flex;
    flex-wrap: wrap;
    margin-top: 50px;
}
.movie-item {
    margin: 4px;
}
.poster img {
    width: 250px;
    height: 380px;
    object-fit: cover;
    border-radius: 5px;
}
.detail {
  background-color: rgb(21, 133, 99);
  color: #fff;
  width: 250px;
  height: 100px;
  display: none;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  transition: 1s;
  padding: 5px;
}
.movie-link {
  position: relative;
}
.movie-link:hover .detail {
  display: block;
}
.rank {
    position: absolute;
    top:0;
    left: 10;
}
.poster>p {
    background:linear-gradient(to bottom right, rgb(8, 218, 183), rgb(53, 197, 24));
    color: rgb(170, 32, 32);
    width: 120px;
    height: 30px;
    text-align: center;
    text-transform: uppercase;
}
h2 {
    margin-top: 50px;
}
</style>
