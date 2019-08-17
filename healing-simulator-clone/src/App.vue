<template>
  <div>
    <div class="container">
      <app-boss
        :health-points="boss.healthPoints"
        :max-health="boss.maxHealthPoints"
        :current-target="boss.currentTarget"
      />
    </div>
    <div class="container">
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
              :classification="raidMembers[index].getClassification()"
            />
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
    </div>
    <div style="min-height: 60px;" class="container">
      <div v-show="isCasting">
        <app-cast-bar
        />
      </div>
    </div>

    <div class="container">
      <app-mana-bar
        :mana-points="manaPoints"
        :max-mana="maxMana" />
    </div>
    <hr>
    <div class="container">
      <div class="spellbar">
        <div v-for="(spell, index) in spellList">
          <app-spell
            :cooldown-time="spell.cooldown"
            :spell-icon="spell.icon"
            :spell-name="spell.name"
            :spell-bar-index="index + 1"
            :internal-cooldown-active="internalCooldownActive" />
        </div>
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
  import {classifications} from "./raiderClassifications";
  import {CombatLogic} from "./combat/CombatLogic";
  import {ArrayHelper} from "./Helpers/ArrayHelper";
  import {BossCombatLogic} from "./combat/BossCombatLogic";

  export default {
    data() {
      return {
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
            cooldown: 5,
            castTime: 2000,
            healAmount: 25,
            targetAmount: 1
          },
          {
            name: spellNames.FLASH_HEAL,
            manaCost: 90,
            icon: 'flash_heal.png',
            cooldown: 3,
            castTime: 1500,
            healAmount: 45,
            targetAmount: 1
          },
          {
            name: spellNames.CIRCLE_OF_HEALING,
            manaCost: 150,
            icon: 'circle_of_healing.png',
            castTime: 1000,
            healAmount: 150,
            cooldown: 4,
            targetAmount: 4
          },
          {
            name: spellNames.RENEW,
            manaCost: 50,
            icon: 'renew.png',
            healAmount: -50,
            cooldown: 1,
            targetAmount: 1
          },
          {
            name: spellNames.DISPEL,
            manaCost: 50,
            icon: 'dispel.png',
            healAmount: 10,
            cooldown: 1,
            targetAmount: 1
          },
          /*{
            name: 'Holy Shock',
            manaCost: 50,
            icon: 'dispel.png',
            cooldown: 5
          }*/
        ],
        boss: {
          healthPoints: 10000,
          maxHealthPoints: 10000,
          minDamage: 50,
          maxDamage: 200,
          currentTarget: null
        }
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
          let classification;
          let healthPoints;
          let maxHealth;
          let damageValue = 0;
          let healingValue = 0;
          switch (i) {
            case 0:
            case 1:
              classification = classifications.TANK;
              healthPoints = 500;
              maxHealth = 500;
              damageValue = 1;
              break;
            case 2:
              classification = classifications.YOU;
              healthPoints = 250;
              maxHealth = 250;
              break;
            case 3:
            case 4:
              classification = classifications.HEALER;
              healthPoints = 200;
              maxHealth = 200;
              healingValue = 20;
              break;
            default:
              classification = classifications.DPS;
              healthPoints = 150;
              maxHealth = 150;
              damageValue = 3;
              break;
          }
          this.raidMembers.push(new RaidMemberModel({
            id: i,
            healthPoints: healthPoints,
            maxHealth: maxHealth,
            isAlive: true,
            isTargeted: false,
            classification: classification,
            damageValue: damageValue,
            healingValue: healingValue
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
          if (spellObject.name === spellNames.CIRCLE_OF_HEALING) {
            targetsToHeal = this.getAoEHealTargets(target, spellObject);
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
      startInternalCooldown() {
        this.internalCooldownActive = true;
        setTimeout(() => {
          this.internalCooldownActive = false;
        }, 1000)
      },
      checkIfEnoughManaForCast(spellObject) {
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
      getLowestHPRaider(unsortedRaiders) {
        let lowest = unsortedRaiders[0];
        for (let i = 1; i < unsortedRaiders.length; i++) {
          if (unsortedRaiders[i].healthPoints < lowest.healthPoints) {
            lowest = unsortedRaiders[i];
          }
        }
        return lowest;
      },
      getAoEHealTargets(target, spellObject) {
        //This should return 4 of the raiders with the lowest amount of hp, that are still alive
        let raiders = Array.from(this.raidMembers);
        raiders.splice(raiders.indexOf(target), 1);
        raiders = ArrayHelper.shuffleArray(raiders);

        //Remove the raiders that are dead or are on 0 hp. So that they are not chosen as heal targets
        for (let i = 0; i < raiders.length; i++) {
          let raider = raiders[i];
          if (raider !== undefined) {
            if (!raider.getIsAlive() || raider.getHealthPoints() <= 0) {
              const index = raiders.indexOf(raiders[i]);
              if (index !== -1) {
                console.log(raiders.splice(index, 1));
                i--;
              }
            }
          }
        }

        let healingTargets = [];
        for (let i = 0; i < spellObject.targetAmount; i++) {
          let lowestHpRaider = this.getLowestHPRaider(raiders);
          if (lowestHpRaider !== undefined) {
            healingTargets.push(lowestHpRaider);
            raiders.splice(raiders.indexOf(lowestHpRaider), 1);
          }
        }
        healingTargets.push(target);
        console.log(healingTargets);
        return healingTargets;
      },

      useMana(manaCost) {
        this.manaPoints -= manaCost;
        if (this.manaPoints <= 0) {
          this.manaPoints = 0;
        }
      },
      killRandomPlayers(amountToKill, raidersArray) {
        for (let i = 0; i < amountToKill; i++) {
          let raider = raidersArray[i];
          raider.setHealthPoints(0);
          raider.setIsAlive(false);
        }
      },
      showRaiderAliveStatus() {
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
        } else if (event.key == '3') {
          this.castHeal(this.spellList[2]);
        } else if (event.key == '4') {
          this.castHeal(this.spellList[3]);
        } else if (event.key == '5') {
          this.castHeal(this.spellList[4]);
        } else if (event.key == '6') {
          this.castHeal(this.spellList[5]);
        } else if (event.key == 'Escape') {
          this.cancelCast();
        } else if (event.key == 'z') {
          this.killRandomPlayers(14, this.raidMembers);
        } else if (event.key == 'x') {
          this.resetGame();
        }
      },
      cancelCast() {
        if (this.isCasting) {
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
        if (this.manaPoints > this.maxMana) {
          this.manaPoints = this.maxMana;
        }
      },
      regenMana(manaAmount) {
        this.manaPoints += manaAmount;
        if (this.manaPoints > this.maxMana) {
          this.manaPoints = this.maxMana;
        }
      },
      finishSpellCast() {
        this.isCasting = false;
        this.spellCurrentlyCasting = null;
      },
      resetGame() {
        this.raidMembers.forEach((raidMember) => {
          raidMember.setIsAlive(true);
          raidMember.setHealthPoints(raidMember.getMaxHealth());
          this.manaPoints = this.maxMana;
        })
      },
      npcHealRaidersEveryFiveSeconds() {
        setInterval(() => CombatLogic.npcHealRaiders(this.raidMembers), 5000)
      },
      dpsDealDamageToBossEverySecond() {
        setInterval(() => this.boss.healthPoints -= CombatLogic.raidersInflictDamage(this.raidMembers), 1000)
      },
      bossAutoHit() {
        setInterval(() => BossCombatLogic.bossNormalAttack(this.raidMembers, this.boss), 1000);
      }
    },


    created() {
      this.createRaiders();
      this.setUpKeyListener();
      //this.inflictPeriodicDamage(1200);
      this.npcHealRaidersEveryFiveSeconds();
      this.dpsDealDamageToBossEverySecond();
      this.bossAutoHit();
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
  .container {
    display: flex;
    justify-content: center;
  }

  .raid-frame {
    border: 1px solid black;
    height: 250px;
    width: 550px;
    margin-top: 10px;
  }

  .inner-raid-frame {
    margin-left: 17px;
    margin-top: 20px;
    width: inherit;
    height: inherit;
  }

  .spellbar {
    width: 550px;
    border: solid 1px black;
    background-color: orange;
    height: 100px;
  }


</style>
