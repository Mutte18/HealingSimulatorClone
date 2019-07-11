<template>
  <div class="outerCastBar">
    <div class="innerCastBar" :style="getCastBarInnerWidth()"></div>
    <div class="castBarText" v-if="spellName !== null"> {{ spellName }} </div>
  </div>
</template>

<script>
  import {EventBus} from "./main";

  export default {
    props: {
    },
    data() {
      return {
        width: 0,
        isCasting: false,
        spellName: null,
      }
    },
    methods: {
      startSpellCast(castTime) {
        this.updateCastBarProgress(castTime);
      },
      finishSpellCast() {
        this.width = 0;
        this.isCasting = false;
      },
      getCastBarInnerWidth() {
        return {
          width: this.width + '%'
        }
      },
      updateCastBarProgress(castTime) {
        let updateRate = (castTime / 50) - 2;
        let updateAmountPerTick = 100 / updateRate;

        let startTime = Date.now();
        const updateProgress = setInterval(() => {

          if (this.width >= 100) {
            let endTime = Date.now() - startTime;
            clearInterval(updateProgress);
            console.log('UPDATERATE:' + updateRate,'ENDTIME:' + endTime);
            this.finishSpellCast();
          } else {
            this.width += updateAmountPerTick;
          }
        }, 50)
      },
    },
    computed: {},
    created() {
      EventBus.$on('startSpellCast', (spellObject) => {
        if (!this.isCasting) {
          this.isCasting = true;
          this.spellName = spellObject.name;
          this.startSpellCast(spellObject.castTime);
        }
      });
    }

  }
</script>

<style scoped>
  .outerCastBar {
    width: 550px;
    height: 50px;
    margin-left: 30%;
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
