<template>
    <div class="spell">
      <img :src="require(`../../assets/${spellIcon}`)" alt="" width="50px" height="50px" style="align-content: center">
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
        }
      },
        data() {
          return {

          }
        }
    }
</script>

<style scoped>
  .spell{
    float: left;
    margin-left: 30px;
    border: solid 1px black
  }
</style>
