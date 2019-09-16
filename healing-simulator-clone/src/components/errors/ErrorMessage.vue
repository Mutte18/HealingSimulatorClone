<template>
  <transition name="fade" mode="in-out">
    <p> {{ errorMessage }}</p>
  </transition>
</template>

<script>
export default {
  props: {
    errorMessage: {
      type: String,

    },
  },
};
</script>

<style scoped>
  p {
    color: red;
    position: relative;
  }

  .fade-enter, .fade-leave-to {
    transition: opacity 0.5s;
  }
  .fade-leave-active {
    position: absolute;
  }
  .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
