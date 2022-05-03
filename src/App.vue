<template>
  <div class="container">
    <router-view v-slot="{ Component, route }">
      <transition name="fade" mode="out-in" appear>
        <div :key="route.fullPath">
          <component :is="Component" />
        </div>  
      </transition>
    </router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {},
  methods: {},
};
</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
  transform: translateX(100px);
}
.fade-enter-active {
  transition: all 0.5s ease-in-out;
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}
.fade-leave-active {
   transition: all 0.5s ease-out;
}
</style>