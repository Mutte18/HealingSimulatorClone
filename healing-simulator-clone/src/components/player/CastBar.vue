<template>
  <div class="outerCastBar">
    <div class="innerCastBar" :style="getCastBarInnerWidth()"></div>
    <div class="castBarText" v-if="spellName !== null"> {{ spellName }}</div>
  </div>
</template>

<script>
import { EventBus } from '../../main';

export default {
  props: {},
  data() {
    return {
      width: 0,
      isCasting: false,
      spellName: null,
      updateProgress: null,
    };
  },
  methods: {
    startSpellCast(castTime) {
      this.updateCastBarProgress(castTime);
    },
    finishSpellCast() {
      this.width = 0;
      this.isCasting = false;
      clearInterval(this.updateProgress);
    },
    getCastBarInnerWidth() {
      return {
        width: `${this.width}%`,
      };
    },
    cancelCast() {

    },
    updateCastBarProgress(castTime) {
      const updateRate = (castTime / 50) - 2;
      const updateAmountPerTick = 100 / updateRate;
      const startTime = Date.now();
      this.updateProgress = setInterval(() => {
        if (this.width >= 100) {
          const endTime = Date.now() - startTime;
          console.log(`UPDATERATE:${updateRate}`, `ENDTIME:${endTime}`);
          this.finishSpellCast();
        } else {
          this.width += updateAmountPerTick;
        }
      }, 50);
    },
  },
  computed: {},
  created() {
    EventBus.$on('finishSpellCast', () => {
      this.finishSpellCast();
    });
    EventBus.$on('startSpellCast', (spellObject) => {
      if (!this.isCasting) {
        this.isCasting = true;
        this.spellName = spellObject.name;
        this.startSpellCast(spellObject.castTime);
      }
    });
    EventBus.$on('cancelCast', () => {
      this.finishSpellCast();
    });
  },

};
</script>

<style scoped>
  .outerCastBar {
    width: 550px;
    height: 50px;
    border: black solid 1px;
  }

  .castBarText {
    position: relative;
    text-align: center;
    bottom: 35px;
  }

  .innerCastBar {
    position: relative;
    height: 50px;
    background-color: yellow;
    transition: width 50ms;
  }
</style>
