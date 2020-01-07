<template>
  <div>
    <div class="raid-member disable-select outerHpBar"
         :class="[
          {hasBossAggro: raider.getHasBossAggro()},
         ]"
    >
      <app-health-bar
        :health-points="raider.getHealthPoints()"
        :max-health="raider.getMaxHealth()"
        :is-alive="raider.getIsAlive()"
        :classification="raider.getClassification()"
      />

    </div>

  </div>
</template>

<script>
import HealthBar from './HealthBar';
import RaidMemberModel from "./RaidMemberModel";

export default {
  props: {
    raider: {
      type: RaidMemberModel,
      required: true
    }
  },
  components: { 'app-health-bar': HealthBar },
};
</script>

<style>

  .raid-member {
    width: 100px;
    height: 50px;
    border: 1px solid black;
    float: left;
    margin-left: 1px;
    cursor: cell;
  }

  .targeted {
    border: solid red 1px;
  }

  .hasBossAggro {
    border: solid red 1px;
  }

  .disable-select {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none;
    /* Non-prefixed version, currently
                                     supported by Chrome and Opera */
  }

</style>
