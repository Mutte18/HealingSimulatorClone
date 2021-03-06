import {EventBus} from "../../main";

export default class RaidMemberModel {
  constructor(raidMember = {}) {
    this.id = raidMember.id;
    this.healthPoints = raidMember.healthPoints;
    this.maxHealth = raidMember.maxHealth;
    this.isAlive = raidMember.isAlive;
    this.isTargeted = raidMember.isTargeted;
    this.hasBossAggro = raidMember.hasBossAggro;
    this.classification = raidMember.classification;
    this.damageValue = raidMember.damageValue;
    this.healingValue = raidMember.healingValue;
  }

  getId() {
    return this.id;
  }

  getHealthPoints() {
    return this.healthPoints;
  }

  reduceHealthPoints(healthValue) {
    this.healthPoints -= healthValue;
    if (this.healthPoints <= 0) {
      this.healthPoints = 0;
      this.isAlive = false;
      this.sendIsDeadEvent();
    }
  }

  getIsFullHealth(){
    return this.healthPoints === this.maxHealth;
  }

  sendIsDeadEvent(){
    EventBus.$emit('raiderDied', this.getClassification());
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

  getMaxHealth() {
    return this.maxHealth;
  }

  getIsAlive() {
    return this.isAlive;
  }

  setIsAlive(value) {
    this.isAlive = value;
  }

  getIsTargeted() {
    return this.isTargeted;
  }

  setIsTargeted(isTargeted) {
    this.isTargeted = isTargeted;
  }

  getClassification() {
    return this.classification;
  }

  getHealingValue() {
    return this.healingValue;
  }

  getDamageValue() {
    return this.damageValue;
  }

  getHasBossAggro() {
    return this.hasBossAggro;
  }

  setHasBossAggro(value) {
    this.hasBossAggro = value;
  }
}
