<template>
  <div class="raid-frame">
    <div v-for="(raidMember, index) in raidMembers">
      <raid-member
        @click.native="setTarget(index)"
        @mouseover.native="setMouseOverTarget(index)"
        @mouseleave="clearMouseOverTarget"
        :id="raidMembers[index].id"
        :is-targeted="raidMembers[index].isTargeted"
        :health-points="raidMembers[index].healthPoints"
        :max-health="raidMembers[index].maxHealth"
      ></raid-member>
    </div>

  </div>
</template>

<script>
  import RaidMember from './RaidMember.vue'
  import {EventBus} from "./main";

  export default {
    data() {
      return {
        raidSize: 5,
        raidMembers: [],
        mouseOverTarget: null
      }
    },
    methods: {
      setTarget(index) {
        this.clearTargets();
        this.raidMembers[index].isTargeted = !this.raidMembers[index].isTargeted;
        this.reduceHealth(index);
        //EventBus.$emit('setTarget', event.target);
      },
      setMouseOverTarget(index) {
        this.mouseOverTarget = this.raidMembers[index];
      },
      clearMouseOverTarget() {
        this.mouseOverTarget = null;
      },
      clearTargets() {
        this.raidMembers.forEach((raidMember) => {
          raidMember.isTargeted = false;
        })
      },
      reduceHealth(index) {
          this.raidMembers[index].healthPoints -= 15;
          if(this.raidMembers[index].healthPoints <= 0)
          {
            this.raidMembers[index].healthPoints = 0;
          }
      },

      createRaiders() {
        for (let i = 0; i < this.raidSize; i++) {
          this.raidMembers.push({
            id: i,
            isTargeted: false,
            healthPoints: 100,
            maxHealth: 100
          })
        }
      },
    },
    created() {
      this.createRaiders();
    },
    components: {
      'raid-member': RaidMember,
    }
  }


</script>

<style>
  .raid-frame {
    border: 1px solid black;
    height: 200px;
    width: 550px;
  }
</style>
