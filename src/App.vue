<template>
  <v-app dark>
    <v-content>
      <NavBar></NavBar>
      <transition
        name="fade"
        mode="out-in"
      >
      <router-view />
      </transition>
    </v-content>
  </v-app>
</template>
<style scoped>
.fade-enter-active, .fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>
<script>
import NavBar from "./components/NavBar.vue"

export default {
  name: "RMD",
  components: {
    NavBar,
  },
  created () {
    this.$vuetify.theme.dark = true
  },
};
</script>
