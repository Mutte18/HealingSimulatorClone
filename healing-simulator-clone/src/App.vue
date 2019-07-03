<template>
  <div>
    <div class="raid-frame">
      <div v-for="(raidMember, index) in raidMembers">
        <raid-member
          @click.native="setTarget(index)"
          @mouseover.native="setMouseOverTarget(index)"
          @mouseleave.native="clearMouseOverTarget"
          :id="raidMembers[index].id"
          :is-targeted="raidMembers[index].isTargeted"
          :health-points="raidMembers[index].healthPoints"
          :max-health="raidMembers[index].maxHealth"
          :is-alive="raidMembers[index].isAlive"
        >
        </raid-member>

      </div>
    </div>
    <br>
    <br>
    <div v-if="mouseOverTarget">
      <raid-member
        :id="mouseOverTarget.id"
        :is-targeted="false"
        :health-points="mouseOverTarget.healthPoints"
        :max-health="mouseOverTarget.maxHealth"
        :is-alive="mouseOverTarget.isAlive"></raid-member>
    </div>
  </div>
</template>

<script>
  import RaidMember from './RaidMember.vue'
  import {EventBus} from "./main";

  export default {
    data() {
      return {
        raidSize: 15,
        raidMembers: [],
        mouseOverTarget: null,
        clickedTarget: null
      }
    },
    methods: {
      setTarget(index) {
        this.clearTargets();
        this.raidMembers[index].isTargeted = !this.raidMembers[index].isTargeted;
        this.clickedTarget = this.raidMembers[index];
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
        if (this.raidMembers[index].healthPoints <= 0) {
          this.raidMembers[index].healthPoints = 0;
        }
      },

      createRaiders() {
        for (let i = 0; i < this.raidSize; i++) {
          this.raidMembers.push({
            id: i,
            isTargeted: false,
            healthPoints: 100,
            maxHealth: 100,
            isAlive: true
          })
        }
      },
      castHeal(){
        let target = null;
        if(this.mouseOverTarget)
        {
          target = this.mouseOverTarget;
        }
        else if(this.clickedTarget){
          target = this.clickedTarget;
        }
        if(target && this.getIsAlive(target)){
          target.healthPoints += 10;
          if(target.healthPoints > target.maxHealth){
            target.healthPoints = target.maxHealth;
          }
        }
        else{
          console.log("No target")
        }
      },
      castAoeHeal(){
        this.raidMembers.forEach((raidMember) => {
          if(this.getIsAlive(raidMember)) {
            raidMember.healthPoints += 20;
            if (raidMember.healthPoints > raidMember.maxHealth) {
              raidMember.healthPoints = raidMember.maxHealth;
            }
          }
        })
      },
      getIsAlive(raidMember){
        return raidMember.isAlive
      },
      doDamage(raidMember, damage){
        raidMember.healthPoints -= damage;
        if(raidMember.healthPoints <= 0){
          raidMember.healthPoints = 0;
          raidMember.isAlive = false;
        }
      },
      inflictPeriodicDamage(interval){
        setInterval(() => {
          this.raidMembers.forEach((raidMember) => {
            this.doDamage(raidMember, this.getRandomDamage())
          })
        }, interval)
      },
      getRandomDamage(){
        return Math.floor(Math.random() * Math.floor(20));
      },
      setUpKeyListener(){
        window.addEventListener('keydown', (event) => {
          this.checkKeyPressed(event);
        })
      },
      checkKeyPressed(event){
        if(event.key == '1'){
          this.castHeal();
        }
        else if(event.key == '2'){
          this.castAoeHeal();
        }
      }
    },
    created() {
      this.createRaiders();
      this.setUpKeyListener();
      this.inflictPeriodicDamage(1000);
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
