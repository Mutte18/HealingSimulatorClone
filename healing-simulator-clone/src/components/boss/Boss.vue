<template>
  <div>
    <div class="container">
      <img :src="require(`../../assets/${bossObject.getPortrait()}`)" width="125px" height="150px" alt=""
           style="border: solid 1px black; ">
    </div>
    <app-boss-health-bar
      :health-points="bossObject.getHealthPoints()"
      :max-health="bossObject.getMaxHealth()"
      :boss-name="bossObject.getName()"
    >
    </app-boss-health-bar>
  </div>
</template>

<script>
import BossHealthBar from './BossHealthBar';
import BossModel from "./BossModel";

export default {

  props: {
    bossObject : {
      type: BossModel,
      required: true
    },
  },
  data() {
    return {
    };
  },
  components: {
    'app-boss-health-bar': BossHealthBar,
  },

};
</script>

<style scoped>


</style>
