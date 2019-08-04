<template>
  <div class="outerHealthBar" :style="getIsAliveBackgroundColorStatus">
    <div class="innerHealthBar" :style="getHealthPointStyle"></div>
    <div class="healthBarText">
      <p>{{displayHealthStatus}}  </p>
  </div>
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
        },
        classification: {
          type: String,
          required: true
        }
      },
      data() {
        return {

        }
      },
      methods: {
        getHealthPercentage(){
          return (this.healthPoints / this.maxHealth) * 100;
        }
      },
      computed: {
        getHealthPointStyle() {
          let backgroundColor = '';
          if (this.getHealthPercentage() > 75) {
            backgroundColor = 'green';
          } else if (this.getHealthPercentage() > 50) {
            backgroundColor = 'lightgreen';
          } else if (this.getHealthPercentage() > 25) {
            backgroundColor = 'yellow';
          } else if (this.getHealthPercentage() > 0) {
            backgroundColor = 'red';
          }
          return {
            backgroundColor: backgroundColor,
            width: this.getHealthPercentage() + '%'
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
            return `HP: ${this.healthPoints} /  ${this.maxHealth} ${this.classification}`
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
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .healthBarText{
    z-index: 1;
  }

  .innerHealthBar{
    position: absolute;
    top:0;
    left:0;
    height: 100%;
    transition: width 500ms;
  }
</style>
