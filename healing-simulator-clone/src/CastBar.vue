<template>
  <div class="outerCastBar">
    <div class="innerCastBar" :style="getCastBarInnerWidth"></div>
    <div class="castBarText"></div>
  </div>
</template>

<script>
  import {EventBus} from "./main";

  export default {
    name: "CastBar",
    props: {
      /*spellName: {
        type: String,
        required: true
      },
      castTime: {
        type: Number,
        required: true
      }*/
    },
    data() {
      return {
        width: 0
      }
  },
    methods: {
      startSpellCast(spell) {
        /*setTimeout(() => {
          this.finishSpellCast();
        }, spell.castTime)*/
        this.updateCastBarProgress(spell.castTime);
      },
      finishSpellCast() {
        this.width = 0;
        EventBus.$emit('spellCastFinished');
      },
      updateCastBarProgress(castTime) {
        let updateRate = castTime / 10000;

        setInterval(() => {
          if(this.width >= 100){
          }
          else {
            this.width++;

          }
        }, updateRate)
      },
    },
    computed: {
      getCastBarInnerWidth() {
        return {
          width: this.width + '%'
        }
      }
    },
    created() {
      EventBus.$on('startSpellCast', (spell) => {
        console.log(spell);
        this.startSpellCast(spell);
      });
    }

  }
</script>

<style scoped>
  .outerCastBar {
    width: 550px;
    height: 50px;
    margin-left: 30%;
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
    transition: width 500ms;
  }
</style>
