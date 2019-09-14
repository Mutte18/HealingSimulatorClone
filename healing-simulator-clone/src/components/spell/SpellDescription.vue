<template>
  <div class="container">
    <div class="spellDescription">
      <h1> {{ spellObject.name}}</h1>
      <p> Heals {{ spellObject.targetAmount }} target for {{ spellObject.healAmount }} damage </p>
      <p> Mana Cost: {{ spellObject.manaCost}}</p>
      <p> Cooldown: {{ spellObject.cooldown}} s</p>
      <p> Cast time: {{ (spellObject.castTime / 1000) }} s</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    spellObject: {
      type: Object,
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
  }

</style>
