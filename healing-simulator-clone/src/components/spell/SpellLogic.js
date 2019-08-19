import {EventBus} from "../../main";

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
  }
};

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
