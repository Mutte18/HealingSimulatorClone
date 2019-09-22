<template>
  <div>
    <div class="container">
      <app-boss
        :boss-object="currentBoss"
      />
    </div>
    <div style="min-height: 50px" class="container">
    <app-error-message v-if="errorMessageActive"
      :error-message="errorMessage"
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
import { ErrorMessages } from './components/errors/ErrorMessages';
import BossModel from "./components/boss/BossModel";
import {BossHelper} from "./components/boss/BossHelper";

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

      bossList: [],
      currentBoss: null,

      gameOver: false,
      errorMessageActive: false,
      errorMessageTimeout: null
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

    castSpell(spellObject) {
      if(!this.gameOver) {
        let target = null;
        if (this.player.target.mouseOverTarget) {
          target = this.player.target.mouseOverTarget;
        } else if (this.player.target.clickedTarget) {
          target = this.player.target.clickedTarget;
        }
        let castResult = SpellLogic.castSpell(
          target,
          spellObject,
          this.player.spell.isCasting,
          this.player.spell.internalCooldownActive,
          this.player.mana.manaPoints,
          this.raidMembers
        );
        if (!castResult) {
          console.log('No target');
          this.setErrorMessage(this.getErrorMessageReason(target, spellObject, this.player.spell, this.player.mana.manaPoints));
        }
      }
    },
    getErrorMessageReason(target, spellObject, playerSpell, playerMana){
      if (!target){
        return ErrorMessages.NoTarget;
      }
      else if (!target.getIsAlive()){
        return ErrorMessages.TargetNotAlive;
      }
      else if (!SpellLogic.checkIfEnoughManaForCast(playerMana, spellObject.getManaCost()))
      {
        return ErrorMessages.NotEnoughMana;
      }
      else if (playerSpell.internalCooldownActive) {
        return ErrorMessages.OnCooldown;
      }
      else {
        return null;
      }
    },

    setErrorMessage(errorMessage) {
      if (errorMessage) {
        this.errorMessage = errorMessage;
      }
        if (!this.errorMessageActive) {
          this.errorMessageActive = true;
          if(!this.gameOver) {
            this.errorMessageTimeout = setTimeout(() => {
            window.clearTimeout(this.errorMessageTimeout);
            this.errorMessageActive = false;
          }, 1500);
        }
      }
    },

    startInternalCooldown() {
      this.player.spell.internalCooldownActive = true;
      setTimeout(() => {
        this.player.spell.internalCooldownActive = false;
      }, 1000);
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
      switch(event.key){
        case '1':
          this.castSpell(this.spellList[0]);
          break;
        case '2':
          this.castSpell(this.spellList[1]);
          break;
        case '3':
          this.castSpell(this.spellList[2]);
          break;
        case '4':
          this.castSpell(this.spellList[3]);
          break;
        case '5':
          this.castSpell(this.spellList[4]);
          break;
        case '6':
          this.castSpell(this.spellList[5]);
          break;
        case '7':
          this.castSpell(this.spellList[6]);
          break;
        case 'g':
          this.currentBoss.setHealthPoints(this.currentBoss.getHealthPoints() / 2);
          break;
        case 'Escape':
          this.cancelCast();
          break;
        case 'z':
          this.killRandomPlayers(14, this.raidMembers);
          break;
        case 'x':
          this.resetGame(true);
          break;
        case 'q':
          ArrayHelper.dealInstantRaidDamage(this.raidMembers);
          break;
      }
    },
    cancelCast() {
      if (this.player.spell.isCasting) {
        EventBus.$emit('cancelCast');
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
    finishSpellCast(spellObject) {
      if (spellObject) {
        this.useMana(spellObject.getManaCost());
      }
      this.player.spell.isCasting = false;
      this.player.spell.spellCurrentlyCasting = null;
    },
    startSpellCast(spellObject){
      this.player.spell.isCasting = true;
      this.startInternalCooldown();
      this.player.spell.spellCurrentlyCasting = spellObject;
    },
    resetGame(fullReset) {
      this.raidMembers.forEach((raidMember) => {
        raidMember.setIsAlive(true);
        raidMember.setHealthPoints(raidMember.getMaxHealth());
      });
      this.player.mana.manaPoints = this.player.mana.maxMana;
      if (fullReset) {
        this.resetBosses();
        this.currentBoss = this.bossList[0];
      }
      this.gameOver = false;
      this.setErrorMessage('');
      this.errorMessageActive = false;
    },
    npcHealRaidersEveryFiveSeconds() {
      setInterval(() => CombatLogic.npcHealRaiders(this.raidMembers), 1000);
    },
    dpsDealDamageToBossEverySecond() {
      setInterval(() => this.currentBoss.reduceHealthPoints(CombatLogic.raidersInflictDamage(this.raidMembers)), 1000);
    },
    bossAutoHit() {
      setInterval(() => BossCombatLogic.bossNormalAttack(
        this.raidMembers,
        this.currentBoss), this.currentBoss.getAttackSpeed());
    },
    checkGameOver(){
      let entireRaidIsDead = true;
      this.raidMembers.forEach((raidMember) => {
        if (raidMember.getIsAlive()) {
          entireRaidIsDead = false;
        }
      });
      if (entireRaidIsDead) {
        this.gameOver = true;
        this.setErrorMessage(ErrorMessages.GameOver);
      }
    },
    startNextBoss(id) {
      if (!this.bossList[id + 1]) {
        this.gameOver = true;
        this.setErrorMessage(ErrorMessages.GameOver);
      }
      else {
        this.currentBoss = this.bossList[id + 1];
        this.resetGame(false);
      }
    },
    listenForDeadRaiderEvents() {
      EventBus.$on('raiderDied', this.checkGameOver);
    },
    listenForStartSpellCastEvent() {
      EventBus.$on('startSpellCast', (spellObject) => this.startSpellCast(spellObject));
    },
    listenForFinishSpellCastEvent() {
      EventBus.$on('finishSpellCast', (result) => this.finishSpellCast(result));
    },
    listenForDeadBossEvents() {
      EventBus.$on('bossDied', (id) => this.startNextBoss(id));
    },
    resetBosses() {
      this.bossList.forEach((boss) => {
        boss.resetBoss();
      })
    }
  },


  created() {
    this.raidMembers = RaiderHelper.createRaiders(this.raidSize);
    this.spellList = SpellList.initializeSpells();
    this.bossList = BossHelper.initBossList();
    this.currentBoss = this.bossList[0];
    this.setUpKeyListener();
    // this.inflictPeriodicDamage(1200);
    //this.npcHealRaidersEveryFiveSeconds();
    this.dpsDealDamageToBossEverySecond();
    this.bossAutoHit();
    this.restorePeriodicMana(this.player.mana.manaRegenRate);
    this.listenForDeadRaiderEvents();
    this.listenForDeadBossEvents();
    this.listenForStartSpellCastEvent();
    this.listenForFinishSpellCastEvent();

  },
  components: {
    'app-raid-member': RaidMember,
    'app-mana-bar': ManaBar,
    'app-boss': Boss,
    'app-spell': Spell,
    'app-cast-bar': CastBar,
    'app-error-message': ErrorMessage,
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
    min-width: 550px;
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
