<template>
  <div>
    <div >
      <img src="./assets/murloc_boss.jpg" width="125px" height="150px" alt=""
           style="border: solid 1px black; margin-left: 47%">
    </div>
  <app-boss-health-bar
    :health-points="healthPoints"
    :max-health="maxHealth"
    :boss-name="bossName"
  >
  </app-boss-health-bar>
  </div>
</template>

<script>
  import BossHealthBar from "./BossHealthBar";

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
    },
    data() {
      return {
        bossName: 'Mighty Murloc'
      }
    },
    components: {
      'app-boss-health-bar': BossHealthBar
    }

  }
</script>

<style scoped>

</style>
