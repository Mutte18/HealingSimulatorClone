import {EventBus} from "../../main";
import {Player} from "../player/Player";

let castTimeout;

export const SpellLogic = {
  castSpell: function (spellObject, targetObjects) {
    let castTime = spellObject.castTime;
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
  cancelCast: function () {
    clearTimeout(castTimeout);
    console.log('clearade timeout');
  },
  canCastSpell(target, spellObject, playerSpell, playerMana){
    return target &&
      target.getIsAlive() &&
      !playerSpell.isCasting &&
      checkIfEnoughManaForCast(playerMana, spellObject.manaCost) &&
      !playerSpell.internalCooldownActive
  },
};

function checkIfEnoughManaForCast(playerMana, spellObjectManaCost) {
  return playerMana - spellObjectManaCost > 0;
}

function performSpellAction(spellObject, targetObjects) {
  let healValue = spellObject.healAmount;
  if (!spellObject || !targetObjects) {
    return;
  }
  if(targetObjects instanceof Array) {
    targetObjects.forEach((target) => {
      if (target.getIsAlive()) {
        target.increaseHealthPoints(healValue);
      }
    });
  }
  else {
    const target = targetObjects;
    if (target.getIsAlive()) {
      target.increaseHealthPoints(healValue);
    }
  }
}
