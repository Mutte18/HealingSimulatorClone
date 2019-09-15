<template>
  <div>
    <div class="container">
      <app-boss
        :health-points="boss.healthPoints"
        :max-health="boss.maxHealthPoints"
        :current-target="boss.currentTarget"
      />
    </div>
    <app-error-message v-if="errorMessage"
      :error-message="errorMessage"
      />
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
      <div v-show="player.spell.isCasting">
        <app-cast-bar
        />
      </div>
    </div>

    <div class="container">
      <app-mana-bar
        :mana-points="player.mana.manaPoints"
        :max-mana="player.mana.maxMana" />
    </div>
    <hr>
    <div class="container">
      <div class="spellbar">
        <div v-for="(spell, index) in spellList">
          <app-spell
            :spell-object="spell"
            :spell-bar-index="index + 1"
            :internal-cooldown-active="player.spell.internalCooldownActive"
            @mouseover.native="setHoveredSpell(spell)"
            @mouseleave.native="clearHoveredSpell(spell)"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RaidMember from './components/raider/RaidMember.vue';
import ErrorMessage from './components/errors/ErrorMessage.vue';
import { EventBus } from './main';
import ManaBar from './components/player/ManaBar.vue';
import Boss from './components/boss/Boss';
import Spell from './components/spell/Spell';
import CastBar from './components/player/CastBar';
import { SpellLogic } from './components/spell/SpellLogic.js';
import { CombatLogic } from './combat/CombatLogic';
import { ArrayHelper } from './Helpers/ArrayHelper';
import { BossCombatLogic } from './combat/BossCombatLogic';
import { RaiderHelper } from './components/raider/RaiderHelper';
import { SpellList } from './components/spell/SpellList';
import {ErrorMessages} from "./components/errors/ErrorMessages";

export default {
  data() {
    return {
      raidSize: 20,
      raidMembers: [],
      errorMessage: '',
      player: {
        target: {
          mouseOverTarget: null,
          clickedTarget: null,
        },
        mana: {
          manaPoints: 1000,
          maxMana: 1000,
          manaRegenAmount: 1,
          manaRegenRate: 500, // milliseconds
        },
        spell: {
          isCasting: false,
          spellCurrentlyCasting: null,
          internalCooldownActive: false,
        },
      },
      spellList: [],
      boss: {
        healthPoints: 10000,
        maxHealthPoints: 10000,
        minDamage: 50,
        maxDamage: 200,
        currentTarget: null,
      },
      gameOver: false,
    };
  },

  methods: {
    setTarget(index) {
      this.clearTargets();
      this.raidMembers[index].setIsTargeted(true);
      this.player.target.clickedTarget = this.raidMembers[index];
      this.reduceHealth(index);
    },
    setMouseOverTarget(index) {
      this.player.target.mouseOverTarget = this.raidMembers[index];
    },
    clearMouseOverTarget() {
      this.player.target.mouseOverTarget = null;
    },
    setHoveredSpell(spell) {
      spell.isHovered = true;
    },
    clearHoveredSpell(spell) {
      spell.isHovered = false;
    },
    clearTargets() {
      this.raidMembers.forEach((raidMember) => {
        raidMember.setIsTargeted(false);
      });
    },
    reduceHealth(index) {
      this.raidMembers[index].reduceHealthPoints(15);
    },

    castHeal(spellObject) {
      let target = null;
      if (this.player.target.mouseOverTarget) {
        target = this.player.target.mouseOverTarget;
      } else if (this.player.target.clickedTarget) {
        target = this.player.target.clickedTarget;
      }
      if (SpellLogic.canCastSpell(target, spellObject, this.player.spell, this.player.mana.manaPoints)) {
        let targetsToHeal = target;
        if (spellObject.targetAmount > 1) {
          targetsToHeal = this.getAoEHealTargets(target, spellObject);
        }
        this.useMana(spellObject.manaCost);
        this.player.spell.isCasting = true;
        this.startInternalCooldown();
        this.player.spell.spellCurrentlyCasting = spellObject;
        SpellLogic.castSpell(spellObject, targetsToHeal);
        // this.castSpell(this.spellList[1], target);
      } else {
        console.log('No target');
        this.setErrorMessage(ErrorMessages.NoTarget);
      }
    },

    setErrorMessage(errorMessage){
      this.errorMessage = errorMessage;

      setTimeout(() => {
        this.errorMessage = null;
      },1500)

    },

    startInternalCooldown() {
      this.player.spell.internalCooldownActive = true;
      setTimeout(() => {
        this.player.spell.internalCooldownActive = false;
      }, 1000);
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
      // This should return 4 of the raiders with the lowest amount of hp, that are still alive
      let raiders = Array.from(this.raidMembers);
      raiders.splice(raiders.indexOf(target), 1);
      raiders = ArrayHelper.shuffleArray(raiders);

      // Remove the raiders that are dead or are on 0 hp. So that they are not chosen as heal targets
      for (let i = 0; i < raiders.length; i++) {
        const raider = raiders[i];
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

      const healingTargets = [];
      for (let i = 0; i < spellObject.targetAmount; i++) {
        const lowestHpRaider = this.getLowestHPRaider(raiders);
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
      this.player.mana.manaPoints -= manaCost;
      if (this.player.mana.manaPoints <= 0) {
        this.player.mana.manaPoints = 0;
      }
    },
    killRandomPlayers(amountToKill, raidersArray) {
      for (let i = 0; i < amountToKill; i++) {
        const raider = raidersArray[i];
        raider.setHealthPoints(0);
        raider.setIsAlive(false);
      }
    },
    showRaiderAliveStatus() {
      const arrayToPrint = [];
      this.raidMembers.forEach((raider) => {
        arrayToPrint.push({ id: raider.getId(), alive: raider.getIsAlive() });
      });
      return arrayToPrint;
    },
    doDamage(raidMember, damage) {
      raidMember.reduceHealthPoints(damage);
    },
    inflictPeriodicDamage(interval) {
      setInterval(() => {
        this.raidMembers.forEach((raidMember) => {
          this.doDamage(raidMember, this.getRandomDamage());
        });
      }, interval);
    },
    checkRaidAliveStatus() {
      const intervalID = setInterval(() => {
        let entireRaidIsDead = true;
        this.raidMembers.forEach((raidMember) => {
          if (raidMember.getIsAlive()) {
            entireRaidIsDead = false;
          }
        });
        if (entireRaidIsDead) {
          this.gameOver = true;
          /*
            STOP THE INTERVAL THIG HERE TO SET GAMEOVER OT ANYMORE
             */
        }
      });
    },
    restorePeriodicMana(manaRegenRate) {
      setInterval(() => {
        this.regenMana(this.player.mana.manaRegenAmount);
      }, manaRegenRate);
    },
    getRandomDamage() {
      return Math.floor(Math.random() * Math.floor(20));
    },
    setUpKeyListener() {
      window.addEventListener('keydown', (event) => {
        this.checkKeyPressed(event);
      });
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
      if (this.player.spell.isCasting) {
        EventBus.$emit('cancelCast');
        this.refundMana(this.spellCurrentlyCasting.manaCost);
        SpellLogic.cancelCast();
        this.player.spell.isCasting = false;
        this.player.spell.internalCooldownActive = false;
        this.player.spell.spellCurrentlyCasting = null;
      }
    },
    refundMana(manaCost) {
      this.player.mana.manaPoints += manaCost;
      if (this.player.mana.manaPoints > this.player.mana.maxMana) {
        this.player.mana.manaPoints = this.player.mana.maxMana;
      }
    },
    regenMana(manaAmount) {
      this.player.mana.manaPoints += manaAmount;
      if (this.player.mana.manaPoints > this.player.mana.maxMana) {
        this.player.mana.manaPoints = this.player.mana.maxMana;
      }
    },
    finishSpellCast() {
      this.player.spell.isCasting = false;
      this.player.spell.spellCurrentlyCasting = null;
    },
    resetGame() {
      this.raidMembers.forEach((raidMember) => {
        raidMember.setIsAlive(true);
        raidMember.setHealthPoints(raidMember.getMaxHealth());
        this.player.mana.manaPoints = this.player.mana.maxMana;
      });
      this.gameOver = false;
    },
    npcHealRaidersEveryFiveSeconds() {
      setInterval(() => CombatLogic.npcHealRaiders(this.raidMembers), 1000);
    },
    dpsDealDamageToBossEverySecond() {
      setInterval(() => this.boss.healthPoints -= CombatLogic.raidersInflictDamage(this.raidMembers), 1000);
    },
    bossAutoHit() {
      setInterval(() => BossCombatLogic.bossNormalAttack(this.raidMembers, this.boss), 1000);
    },
  },


  created() {
    this.raidMembers = RaiderHelper.createRaiders(this.raidSize);
    this.spellList = SpellList.initializeSpells();
    this.setUpKeyListener();
    // this.inflictPeriodicDamage(1200);
    this.npcHealRaidersEveryFiveSeconds();
    this.dpsDealDamageToBossEverySecond();
    this.bossAutoHit();
    this.restorePeriodicMana(this.player.mana.manaRegenRate);
    EventBus.$on('spellCastFinish', () => {
      this.finishSpellCast();
    });
  },
  components: {
    'app-raid-member': RaidMember,
    'app-mana-bar': ManaBar,
    'app-boss': Boss,
    'app-spell': Spell,
    'app-cast-bar': CastBar,
    'app-error-message': ErrorMessage
  },
};


</script>

<style>
  .container {
    display: flex;
    justify-content: center;
  }

  .raid-frame {
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    width: 550px;
    justify-content: left;
    margin-top: 10px;
  }

  .inner-raid-frame {
    margin-left: 17px;
    margin-top: 20px;
    margin-bottom: 20px;

  }

  .spellbar {
    width: 600px;
    border: solid 1px black;
    background-color: orange;
    padding-top: 5px;
    display: flex;
    justify-content: space-evenly;
  }


</style>
