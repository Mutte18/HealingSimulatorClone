import {EventBus} from "./main";

let castTimeout;

export const SpellLogic = {
  castSpell: function (spellObject, targetObject) {
    let castTime = spellObject.castTime;
    console.log(castTime);
    if (castTime > 0) {
      EventBus.$emit('startSpellCast', spellObject);
      castTimeout = setTimeout(() => {
        performSpellAction(spellObject, targetObject);
        EventBus.$emit('spellCastFinish');
      }, castTime);
    } else {
      performSpellAction(spellObject, targetObject);
      EventBus.$emit('spellCastFinish');
    }
  },
  cancelCast: function () {
    clearTimeout(castTimeout);
    console.log('clearade timeout');
  }
};

function performSpellAction(spellObject, targetObject) {
  let healValue = spellObject.healAmount;
  if (!spellObject || !targetObject) {
    return;
  }
  if (targetObject.getIsAlive()) {
    targetObject.increaseHealthPoints(healValue);
  }
}
