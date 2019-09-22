import {EventBus} from "../../main";

export default class BossModel {
  constructor(boss = {}) {
    this.id = boss.id;
    this.name = boss.name;
    this.portrait = boss.portrait;
    this.healthPoints = boss.healthPoints;
    this.maxHealth = boss.maxHealth;
    this.isAlive = boss.isAlive;
    this.minDamage = boss.minDamage;
    this.maxDamage = boss.maxDamage;
    this.attackSpeed = boss.attackSpeed;
    this.critChance = boss.critChance;
    this.currentTarget = boss.currentTarget;
  }

  getId() {
    return this.id;
  }

  getHealthPoints() {
    return this.healthPoints;
  }

  getName() {
    return this.name;
  }

  getPortrait() {
    return this.portrait;
  }

  getIsFullHealth(){
    return this.healthPoints === this.maxHealth;
  }

  getMaxHealth() {
    return this.maxHealth;
  }

  getIsAlive() {
    return this.isAlive;
  }

  getMinDamage() {
    return this.minDamage;
  }

  getMaxDamage() {
    return this.maxDamage;
  }

  getAttackSpeed() {
    return this.attackSpeed;
  }

  getCritChance() {
    return this.critChance;
  }

  getCurrentTarget() {
    return this.currentTarget;
  }

  setCurrentTarget(target) {
    this.currentTarget = target;
  }

  setIsAlive(value) {
    this.isAlive = value;
  }



  reduceHealthPoints(healthValue) {
    this.healthPoints -= healthValue;
    if (this.healthPoints <= 0) {
      this.healthPoints = 0;
      this.isAlive = false;
      this.sendIsDeadEvent();
    }
  }

  sendIsDeadEvent(){
    EventBus.$emit('bossDied', this.getId());
  }

  increaseHealthPoints(healthValue) {
    this.healthPoints += healthValue;
    if (this.healthPoints > this.maxHealth) {
      this.healthPoints = this.maxHealth;
    }
  }

  setHealthPoints(newHealthValue) {
    this.healthPoints = newHealthValue;
  }

  resetBoss() {
    this.healthPoints = this.maxHealth;
    this.isAlive = true;
  }




}
