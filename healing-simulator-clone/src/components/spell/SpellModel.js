
export default class SpellModel {
  constructor(spell = {}) {
    this.name = spell.name;
    this.icon = spell.icon;
    this.healAmount = spell.healAmount;
    this.manaCost = spell.manaCost;
    this.castTime = spell.castTime;
    this.coolDown = spell.coolDown;
    this.extraTargets = spell.extraTargets;
    this.isHovered = spell.isHovered;
  }

  getName() {
    return this.name;
  }

  getIcon() {
    return this.icon;
  }

  getHealAmount() {
    return this.healAmount;
  }

  getManaCost() {
    return this.manaCost;
  }

  getCastTime() {
    return this.castTime;
  }

  getCoolDown() {
    return this.coolDown;
  }

  getExtraTargets() {
    return this.extraTargets;
  }

  getIsHovered() {
    return this.isHovered;
  }
}
