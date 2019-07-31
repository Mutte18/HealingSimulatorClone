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
        {{ mouseOverTarget }}
      </div> -->

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
        :spell-bar-index="index + 1"
        :internal-cooldown-active="internalCooldownActive">
      </app-spell>
      </div>
    </div>
  </div>
</template>

<script>
  import RaidMember from './components/raider/RaidMember.vue';
  import {EventBus} from "./main";
  import RaidMemberModel from './RaidMemberModel';
  import ManaBar from "./components/player/ManaBar.vue";
  import Boss from "./components/boss/Boss";
  import Spell from "./components/player/Spell"
  import CastBar from "./components/player/CastBar"
  import {SpellLogic} from './SpellLogic.js';
  import {spellNames} from './SpellsNameEnum';

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
        spellCurrentlyCasting: null,
        raidFuckery: null,
        internalCooldownActive: false,
        spellList: [
          {
            name: spellNames.HEAL,
            manaCost: 50,
            icon: 'heal.png',
            cooldown: 1,
            castTime: 2000,
            healAmount: 25
          },
          {
            name: spellNames.FLASH_HEAL,
            manaCost: 90,
            icon: 'flash_heal.png',
            cooldown: 1,
            castTime: 1500,
            healAmount: 45
          },
          {
            name: spellNames.CIRCLE_OF_HEALING,
            manaCost: 150,
            icon: 'circle_of_healing.png',
            castTime: 1000,
            healAmount: 150,
            cooldown: 1
          },
          {
            name: spellNames.RENEW,
            manaCost: 50,
            icon: 'renew.png',
            healAmount: -50,
            cooldown: 1
          },
          {
            name: spellNames.DISPEL,
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
            healthPoints: 85,
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
        if (
          target &&
          target.getIsAlive() &&
          !this.isCasting &&
          this.checkIfEnoughManaForCast(spellObject) &&
          !this.internalCooldownActive
        ) {
          let targetsToHeal = target;
          if(spellObject.name === spellNames.CIRCLE_OF_HEALING){
            targetsToHeal = this.getAoEHealTargets(target);
          }
          this.useMana(spellObject.manaCost);
          this.isCasting = true;
          this.startInternalCooldown();
          this.spellCurrentlyCasting = spellObject;
          SpellLogic.castSpell(spellObject, targetsToHeal);
          //this.castSpell(this.spellList[1], target);
        } else {
          console.log("No target")
        }

      },
      startInternalCooldown(){
        this.internalCooldownActive = true;
        setTimeout(() => {
          this.internalCooldownActive = false;
        }, 1000)
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
      getLowestHPRaider(unsortedRaiders){
        let lowest = unsortedRaiders[0];
        for (let i = 1; i < unsortedRaiders.length; i++) {
          if (unsortedRaiders[i].healthPoints < lowest.healthPoints){
            lowest = unsortedRaiders[i];
          }
        }
        return lowest;
      },
      getAoEHealTargets(target){
        //This should return 4 of the raiders with the lowest amount of hp, that are still alive
        let raiders = Array.from(this.raidMembers);
        raiders.splice(raiders.indexOf(target), 1);
        this.shuffleArray(raiders);

        for(let i = 0; i < raiders.length; i++){
          if(raiders[i] !== undefined) {
            if (!raiders[i].getIsAlive()) {
              const index = raiders.indexOf(raiders[i]);
              if (index !== -1) {
                console.log(raiders.splice(index, 1));
                i--;
              }
            }
          }
        }
        console.log(raiders.length);


        let healingTargets = [];
        for(let i = 0; i < 4; i++){
          let lowestHpRaider = this.getLowestHPRaider(raiders);
          if(lowestHpRaider !== undefined) {
            healingTargets.push(lowestHpRaider);
            raiders.splice(raiders.indexOf(lowestHpRaider), 1);
          }
        }
        healingTargets.push(target);
        console.log(healingTargets);
        return healingTargets;
      },

      shuffleArray(array){
        let currentIndex = array.length;
        let temporaryValue ;
        let randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;

          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }

        return array;
      },
      useMana(manaCost) {
        this.manaPoints -= manaCost;
        if (this.manaPoints <= 0) {
          this.manaPoints = 0;
        }
      },
      showRaiderAliveStatus(){
        const arrayToPrint = [];
        this.raidMembers.forEach((raider) => {
          arrayToPrint.push({id: raider.getId(), alive: raider.getIsAlive()})
        });
        return arrayToPrint;
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
          this.regenMana(this.manaRegenAmount);
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
          this.cancelCast();
        }else if (event.key == 'z'){

        }

        else if(event.key == 'x'){
          this.resetGame();
        }
      },
      cancelCast(){
        if(this.isCasting){
          EventBus.$emit('cancelCast');
          this.refundMana(this.spellCurrentlyCasting.manaCost);
          SpellLogic.cancelCast();
          this.isCasting = false;
          this.internalCooldownActive = false;
          this.spellCurrentlyCasting = null;
        }
      },
      refundMana(manaCost) {
        this.manaPoints += manaCost;
        if(this.manaPoints > this.maxMana){
          this.manaPoints = this.maxMana;
        }
      },
      regenMana(manaAmount) {
        this.manaPoints += manaAmount;
        if (this.manaPoints > this.maxMana) {
          this.manaPoints = this.maxMana;
        }
      },
      finishSpellCast(){
        this.isCasting = false;
        this.spellCurrentlyCasting = null;
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
      this.inflictPeriodicDamage(1200);
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
