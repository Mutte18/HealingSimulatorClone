<template>

  <div class="spell">
    <div class="timer" v-if="internalCooldownActive && !onCooldown">
    </div>
      <img :src="require(`../../assets/${spellIcon}`)"
           alt=""
           width="50px"
           height="50px"
           style="align-content: center"
      >
      <p v-if="onCooldown" style="font-size: 24px;"> {{ this.remainingCooldown }}</p>

      <br>{{ spellName }}
      <br>{{ spellBarIndex }}
  </div>
</template>

<script>
  export default {
    props: {
      spellIcon: {
        type: String,
        required: true
      },
      cooldownTime: {
        type: Number,
        required: true
      },
      spellBarIndex: {
        type: Number,
        required: true
      },
      spellName: {
        type: String,
        required: true
      },
      internalCooldownActive: {
        type: Boolean,
        required: true
      },
    },
    data() {
      return {
        remainingCooldown: this.cooldownTime,
        onCooldown: false
      }
    },
    methods: {
      startCooldown(){
        this.onCooldown = true;
        setInterval(() => {
          this.remainingCooldown -= 1;
          if(this.remainingCooldown <= 0){
            clearInterval();
            this.remainingCooldown = this.cooldownTime;
            this.onCooldown = false;
          }
        }, 1000)
      }
    },
    created(){
      this.startCooldown();
    }
  }
</script>

<style scoped>
  .spell {
    float: left;
    margin-left: 30px;
    border: solid 1px black;
    z-index: 0;
  }

  .timer {
    border-radius: 50%;
    height: 50px;
    width: 50px;
    background: linear-gradient(90deg, black 50%, gray 50%);
    position: absolute;
    z-index: 1;
    animation: timer 1s steps(1000, start) 1;
    opacity: 0.7;
  }

  .timer:after {
    border-radius: 100% 0 0 100% / 50% 0 0 50%;
    content: '';
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 50%;
    transform-origin: 100% 50%;
    animation: mask 1s steps(1000, start) 1;
  }

  @keyframes timer {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes mask {
    0% {
      background: gray;
      transform: rotate(0deg);
    }
    50% {
      background: gray;
      transform: rotate(-180deg);
    }
    50.01% {
      background: black;
      transform: rotate(0deg);
    }
    100% {
      background: black;
      transform: rotate(-180deg);
    }

  }
</style>
