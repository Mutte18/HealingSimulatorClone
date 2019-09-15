import { EventBus } from '../../main';

let castTimeout;

export const SpellLogic = {
  castSpell(spellObject, targetObjects) {
    const { castTime } = spellObject;
    console.log(castTime);
    if (castTime > 0) {
      EventBus.$emit('startSpellCast', spellObject);
      castTimeout = setTimeout(() => {
        performSpellAction(spellObject, targetObjects);
        EventBus.$emit('spellCastFinish');
      }, castTime);
    } else {
      performSpellAction(spellObject, targetObjects);
      EventBus.$emit('spellCastFinish');
    }
  },
  cancelCast() {
    clearTimeout(castTimeout);
    console.log('clearade timeout');
  },
  canCastSpell(target, spellObject, playerSpell, playerMana) {
    return target
      && target.getIsAlive()
      && !playerSpell.isCasting
      && this.checkIfEnoughManaForCast(playerMana, spellObject.manaCost)
      && !playerSpell.internalCooldownActive;
  },

  checkIfEnoughManaForCast(playerMana, spellObjectManaCost) {
    return playerMana - spellObjectManaCost > 0;
  }
};


function performSpellAction(spellObject, targetObjects) {
  const healValue = spellObject.healAmount;
  if (!spellObject || !targetObjects) {
    return;
  }
  if (targetObjects instanceof Array) {
    targetObjects.forEach((target) => {
      if (target.getIsAlive()) {
        target.increaseHealthPoints(healValue);
      }
    });
  } else {
    const target = targetObjects;
    if (target.getIsAlive()) {
      target.increaseHealthPoints(healValue);
    }
  }
}
