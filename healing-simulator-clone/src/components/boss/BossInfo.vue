<template>
  <div class="bossInfoContainer">
    <div class="bossInfo">
      <h1> {{ bossModel.getName()}}</h1>
      <p> HP: {{ bossModel.getHealthPoints() }} / {{ bossModel.getMaxHealth() }}</p>
      <p> Damage: {{ bossModel.getMinDamage() }} - {{ bossModel.getMaxDamage() }}</p>
      <p> Crit Chance: {{ bossModel.getCritChance() }}%</p>
      <p> Attack Speed: {{ bossModel.getAttackSpeed() / 1000 }}s </p>
    </div>
  </div>
</template>

<script>
    import BossModel from "./BossModel";

    export default {
      props: {
        bossModel: BossModel
      }
    }
</script>

<style scoped>
  .bossInfoContainer {
    display: flex;
    justify-content: center;
  }
  .bossInfo {
    background-color: lightgrey;
    position: absolute;
    border: 1px black solid;
    border-radius: 15px;
    text-align: center;
    text-overflow-mode: true;
    padding: 0 10px 0 10px;
    margin-left: 30%;
  }
</style>
