<template>
  <div class="outerManaBar">
    <div class="innerManaBar" :style="getManaPointStyle"></div>
    <div class="manaBarText"> {{ manaPoints }} / {{ maxMana }} </div>
  </div>
</template>

<script>
    export default {
      props: {
        manaPoints: {
          type: Number,
          required: true
        },
        maxMana: {
          type: Number,
          required: true
        },
      },
      data() {
        return {

        }
      },
      computed: {
        getManaPointStyle(){
          let manaPointsPercentage = (this.manaPoints / this.maxMana) * 100;
          if(manaPointsPercentage <= 0)
          {
            manaPointsPercentage = 0;
          }
          return {
            width: manaPointsPercentage + '%'
          }
        }
      },
      created(){

      }
    }
</script>

<style scoped>
  .outerManaBar{
    width: 550px;
    height: 50px;
    background-color: lightblue;
    border: solid black 1px;
    color: white;

  }

  .manaBarText{
    position: relative;
    text-align: center;
    bottom: 35px;
  }

  .innerManaBar{
    width: inherit;
    position: relative;
    height: 50px;
    background-color: blue;
    transition: width 500ms;
  }
</style>
