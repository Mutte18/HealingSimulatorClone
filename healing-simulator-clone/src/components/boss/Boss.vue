<template>
  <div>
    <div class="container">
      <img :src="require(`../../assets/${bossObject.getPortrait()}`)" width="130px" height="150px" alt=""
           style="border: solid 2px black; "
           @mouseover="bossObject.setIsHovered(true)"
           @mouseleave="bossObject.setIsHovered(false)">
      <div v-if="bossObject.getIsHovered()">
        <app-boss-info
          :boss-model="bossObject"
        />
      </div>
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
import BossInfo from "./BossInfo";

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
    'app-boss-info': BossInfo,
    'app-boss-health-bar': BossHealthBar,
  },

};
</script>

<style scoped>


</style>
