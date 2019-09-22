<template>
  <div class="container">
    <div class="spellDescription">
      <h1> {{ spellObject.getName()}}</h1>
      <p> Heals {{ spellObject.getExtraTargets() }} target for {{ spellObject.getHealAmount() }} damage </p>
      <p> Mana Cost: {{ spellObject.getManaCost()}}</p>
      <p> Cooldown: {{ spellObject.getCoolDown()}} s</p>
      <p> Cast time: {{ (spellObject.getCastTime() / 1000) }} s</p>
    </div>
  </div>
</template>

<script>
import SpellModel from "./SpellModel";

export default {
  props: {
    spellObject: {
      type: SpellModel,
      required: true,
    },
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
  .spellDescription {
    background-color: lightgrey;
    position: absolute;
    border: 1px black solid;
    border-radius: 15px;
    text-align: center;
    text-overflow-mode: true;
    margin-top: 10px;
    padding: 0 10px 0 10px;
  }

</style>
