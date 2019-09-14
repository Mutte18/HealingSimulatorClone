<template>
  <div class="outerHealthBar" style="background-color: darkgoldenrod">
    <div class="innerHealthBar" :style="getHealthPointStyle"></div>
    <div class="healthBarText">
      {{ bossName }}
      <br>
      {{ getHealthAsPercentage }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    healthPoints: {
      type: Number,
      required: true,
    },
    maxHealth: {
      type: Number,
      required: true,
    },
    bossName: {
      type: String,
      required: true,
    },
  },
  computed: {
    getHealthAsPercentage() {
      const percentage = (this.healthPoints / this.maxHealth) * 100;
      return `${percentage}%`;
    },
    getHealthPointStyle() {
      let percentage = (this.healthPoints / this.maxHealth) * 100;
      if (percentage <= 0) {
        percentage = 0;
      }
      return {
        width: `${percentage}%`,
      };
    },
  },
};
</script>

<style scoped>
  .outerHealthBar{
    width: 1000px;
    height: 50px;
    border: solid 1px black;

  }

  .healthBarText{
    position: relative;
    text-align: center;
    color: white;
    bottom: 40px;
  }

  .innerHealthBar{
    width: inherit;
    position: relative;
    height: 50px;
    transition: width 500ms;
    background-color: darkgreen;
  }
</style>
