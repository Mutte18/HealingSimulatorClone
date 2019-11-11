<template>
  <div class="outerHealthBar" :style="getIsAliveBackgroundColorStatus">
    <div class="innerHealthBar" :style="getClassHealthbars"></div>
    <div class="healthBarText">
      <p v-if="isAlive">
        HP: {{  this.healthPoints }} / {{ this.maxHealth }} <br>
        <span class="classification">{{ this.classification }} </span>
      </p>
      <p v-else> DEAD </p>
  </div>
  </div>
</template>

<script>
import { classifications } from '../../raiderClassifications';

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
    isAlive: {
      type: Boolean,
      required: true,
    },
    classification: {
      type: String,
      required: true,
    },
  },
  data() {
    return {

    };
  },
  methods: {
    getHealthPercentage() {
      return (this.healthPoints / this.maxHealth) * 100;
    },
  },
  computed: {
    /*getHealthPointStyle() {
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
        backgroundColor,
        width: `${this.getHealthPercentage()}%`,
      };
    },*/
    getClassHealthbars() {
      let backgroundColor = '';
      switch (this.classification) {
        case classifications.TANK:
          backgroundColor = 'saddlebrown';
          break;
        case classifications.HEALER:
          backgroundColor = 'darkgoldenrod';
          break;
        case classifications.DPS:
          backgroundColor = 'green';
          break;
        case classifications.YOU:
          backgroundColor = 'teal';
          break;
      }
      return {
        backgroundColor,
        width: `${this.getHealthPercentage()}%`,
      };
    },
    getIsAliveBackgroundColorStatus() {
      if (this.isAlive) {
        return {
          backgroundColor: 'lightgray',
        };
      }

      return {
        backgroundColor: 'dimgray',
      };
    },
  },
};
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

  .healthBarText {
    z-index: 0;
  }

  .classification {
    display: flex;
    justify-content: center;
  }

  .innerHealthBar{
    position: absolute;
    top:0;
    left:0;
    height: 100%;
    transition: width 200ms;
    background-color: gold;
  }
</style>
