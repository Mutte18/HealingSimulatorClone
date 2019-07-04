<template>
  <div class="outerHealthBar" :style="getIsAliveBackgroundColorStatus">
    <div class="innerHealthBar" :style="getHealthPointStyle"></div>
    <div class="healthBarText"> {{displayHealthStatus}} </div>
  </div>
</template>

<script>
    export default {
      props: {
        healthPoints: {
          type: Number,
          required: true
        },
        maxHealth: {
          type: Number,
          required: true
        },
        isAlive: {
          type: Boolean,
          required: true
        }
      },
      data() {
        return {

        }
      },
      methods: {

      },
      computed: {
        getHealthPointStyle() {
          let backgroundColor = '';
          if (this.healthPoints > 75) {
            backgroundColor = 'green';
          } else if (this.healthPoints > 50) {
            backgroundColor = 'lightgreen';
          } else if (this.healthPoints > 25) {
            backgroundColor = 'yellow';
          } else if (this.healthPoints > 0) {
            backgroundColor = 'red';
          }
          return {
            backgroundColor: backgroundColor,
            width: this.healthPoints + '%'
          }
        },
        getIsAliveBackgroundColorStatus(){
          if(this.isAlive){
            return {
              backgroundColor: 'lightgray'
            }
          }
          else {
            return {
              backgroundColor: 'dimgray'
            }
          }
        },
        displayHealthStatus() {
          if(this.isAlive){
            return `${this.healthPoints} /  ${this.maxHealth}`
          }
          else {
            return 'DEAD'
          }
        }
      },
    }
</script>

<style scoped>
  .outerHealthBar{
    width: 100%;
    height: 50px;
    margin: auto 0;
  }

  .healthBarText{
    position: relative;
    text-align: center;
    bottom: 35px;
  }

  .innerHealthBar{
    width: inherit;
    position: relative;
    height: 50px;
    transition: width 500ms;
  }
</style>
