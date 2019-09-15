<template>
    <p> {{ errorMessage }}</p>
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
    display: flex;
    justify-content: center;
  }
</style>
