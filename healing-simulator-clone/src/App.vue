<template>
  <div>
    <app-boss
      :health-points="bossHp"
      :max-health="10000"
    ></app-boss>
    <div class="raid-frame">
      <div class=inner-raid-frame>
        <div v-for="(raidMember, index) in raidMembers">
          <app-raid-member
            @click.native="setTarget(index)"
            @mouseover.native="setMouseOverTarget(index)"
            @mouseleave.native="clearMouseOverTarget"
            :id="raidMembers[index].getId()"
            :is-targeted="raidMembers[index].getIsTargeted()"
            :health-points="raidMembers[index].getHealthPoints()"
            :max-health="raidMembers[index].getMaxHealth()"
            :is-alive="raidMembers[index].getIsAlive()"
          >
          </app-raid-member>
        </div>
      </div>
      <!--<div v-if="mouseOverTarget">
        <app-raid-member
          :id="mouseOverTarget.getId()"
          :is-targeted="false"
          :health-points="mouseOverTarget.getHealthPoints()"
          :max-health="mouseOverTarget.getMaxHealth()"
          :is-alive="mouseOverTarget.getIsAlive()">
        </app-raid-member>
      </div>
      -->
    </div>
    <div style="min-height: 60px;">
    <div v-show="isCasting">
      <app-cast-bar></app-cast-bar>
    </div>

    </div>
    <app-mana-bar
      :mana-points="manaPoints"
      :max-mana="maxMana">
    </app-mana-bar>
    <hr>
    <div class="spellbar">
      <div v-for="(spell, index) in spellList">
      <app-spell
        :cooldown-time="spell.cooldown"
        :spell-icon="spell.icon"
        :spell-name="spell.name"
        :spell-bar-index="index + 1">
      </app-spell>
      </div>
    </div>
  </div>
</template>

<script>
  import RaidMember from './RaidMember.vue';
  import {EventBus} from "./main";
  import RaidMemberModel from './RaidMemberModel';
  import ManaBar from "./ManaBar.vue";
  import Boss from "./Boss";
  import Spell from "./Spell"
  import CastBar from "./CastBar"
  import {SpellLogic} from './SpellLogic.js';

  export default {
    data() {
      return {
        bossHp: 10000,
        raidSize: 20,
        raidMembers: [],
        mouseOverTarget: null,
        clickedTarget: null,
        isCasting: false,
        manaPoints: 1000,
        maxMana: 1000,
        manaRegenAmount: 1,
        manaRegenRate: 500, //milliseconds
        spellList: [
          {
            name: 'Heal',
            manaCost: 50,
            icon: 'heal.png',
            cooldown: 1,
            castTime: 2000,
            healAmount: 25
          },
          {
            name: 'Flash Heal',
            manaCost: 90,
            icon: 'flash_heal.png',
            cooldown: 1,
            castTime: 20000,
            healAmount: 45
          },
          {
            name: 'Circle of Healing',
            manaCost: 50,
            icon: 'circle_of_healing.png',
            castTime: 0,
            healAmount: 150,
            cooldown: 1
          },
          {
            name: 'Renew',
            manaCost: 50,
            icon: 'renew.png',
            healAmount: -50,
            cooldown: 1
          },
          {
            name: 'Dispel',
            manaCost: 50,
            icon: 'dispel.png',
            healAmount: 10,
            cooldown: 1
          },
          /*{
            name: 'Holy Shock',
            manaCost: 50,
            icon: 'dispel.png',
            cooldown: 5
          }*/
        ]
      }
    },

    methods: {
      setTarget(index) {
        this.clearTargets();
        this.raidMembers[index].setIsTargeted(true);
        this.clickedTarget = this.raidMembers[index];
        this.reduceHealth(index);
      },
      setMouseOverTarget(index) {
        this.mouseOverTarget = this.raidMembers[index];
      },
      clearMouseOverTarget() {
        this.mouseOverTarget = null;
      },
      clearTargets() {
        this.raidMembers.forEach((raidMember) => {
          raidMember.setIsTargeted(false);
        })
      },
      reduceHealth(index) {
        this.raidMembers[index].reduceHealthPoints(15);
      },

      createRaiders() {
        for (let i = 0; i < this.raidSize; i++) {
          this.raidMembers.push(new RaidMemberModel({
            id: i,
            healthPoints: 100,
            maxHealth: 100,
            isAlive: true,
            isTargeted: false
          }));
        }
      },
      castHeal(spellObject) {
        let target = null;
        if (this.mouseOverTarget) {
          target = this.mouseOverTarget;
        } else if (this.clickedTarget) {
          target = this.clickedTarget;
        }
        if (target && target.getIsAlive() && !this.isCasting && this.checkIfEnoughManaForCast(spellObject)) {
          this.useMana(spellObject.manaCost);
          this.isCasting = true;
          SpellLogic.castSpell(spellObject, target);
          //this.castSpell(this.spellList[1], target);
        } else {
          console.log("No target")
        }

      },
      checkIfEnoughManaForCast(spellObject){
        return this.manaPoints - spellObject.manaCost > 0;
      },
      castAoeHeal() {
        this.raidMembers.forEach((raidMember) => {
          if (raidMember.getIsAlive()) {
            raidMember.increaseHealthPoints(20);
          }
        });
        this.useMana(150);
      },
      useMana(manaCost) {
        this.manaPoints -= manaCost;
        if (this.manaPoints <= 0) {
          this.manaPoints = 0;
        }
      },
      doDamage(raidMember, damage) {
        raidMember.reduceHealthPoints(damage);
      },
      inflictPeriodicDamage(interval) {
        setInterval(() => {
          this.raidMembers.forEach((raidMember) => {
            this.doDamage(raidMember, this.getRandomDamage())
          })
        }, interval)
      },
      restorePeriodicMana(manaRegenRate) {
        setInterval(() => {
          this.regenMana(this.manaRegenAmount)
          this.bossHp -= 1;
        }, manaRegenRate)
      },
      getRandomDamage() {
        return Math.floor(Math.random() * Math.floor(20));
      },
      setUpKeyListener() {
        window.addEventListener('keydown', (event) => {
          this.checkKeyPressed(event);
        })
      },
      checkKeyPressed(event) {
        if (event.key == '1') {
          this.castHeal(this.spellList[0]);
        } else if (event.key == '2') {
          this.castHeal(this.spellList[1]);
        }else if (event.key == '3') {
          this.castHeal(this.spellList[2]);
        }else if (event.key == '4') {
          this.castHeal(this.spellList[3]);
        }else if (event.key == '5') {
          this.castHeal(this.spellList[4]);
        }else if (event.key == '6') {
          this.castHeal(this.spellList[5]);
        }else if (event.key == 'Escape') {

        }

        else if(event.key == 'x'){
          this.resetGame();
        }
      },
      cancelCast(){
        if(this.isCasting){
          EventBus.$emit('cancelCast');
          this.isCasting = false;
        }
      },
      regenMana(manaAmount) {
        this.manaPoints += manaAmount;
        if (this.manaPoints > this.maxMana) {
          this.manaPoints = this.maxMana;
        }
      },
      finishSpellCast(){
        console.log("Fick event");
        this.isCasting = false;
      },
      resetGame(){
        this.raidMembers.forEach((raidMember) => {
          raidMember.setIsAlive(true);
          raidMember.setHealthPoints(raidMember.getMaxHealth());
          this.manaPoints = this.maxMana;
        })
      }
    },



    created() {
      this.createRaiders();
      this.setUpKeyListener();
      this.inflictPeriodicDamage(1000);
      this.restorePeriodicMana(this.manaRegenRate);
      EventBus.$on('spellCastFinish', () => {
        this.finishSpellCast();
      });
    },
    components: {
      'app-raid-member': RaidMember,
      'app-mana-bar': ManaBar,
      'app-boss': Boss,
      'app-spell': Spell,
      'app-cast-bar': CastBar
    }
  }


</script>

<style>
  .raid-frame {
    border: 1px solid black;
    height: 250px;
    width: 550px;
    margin-left: 30%;
    margin-top: 5%;
  }

  .inner-raid-frame {
    margin-left: 17px;
    margin-top: 20px;
    width: inherit;
    height: inherit;
  }

  .spellbar {
    margin-left: 30%;
    width: 550px;
    border: solid 1px black;
    background-color: orange;
    height: 100px;
  }
</style>
