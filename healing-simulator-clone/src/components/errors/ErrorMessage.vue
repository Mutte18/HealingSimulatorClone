<template>
  <transition name="fade">
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

  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-leave-to, .fade-enter /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
