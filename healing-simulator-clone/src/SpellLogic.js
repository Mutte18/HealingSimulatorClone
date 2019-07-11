import {EventBus} from "./main";

export const SpellLogic = {
  castSpell: function (spellObject, targetObject) {
    let castTime = spellObject.castTime;
    console.log(castTime);
    if (castTime > 0) {
      EventBus.$emit('startSpellCast', spellObject);
      setTimeout(() => {
        performSpellAction(spellObject, targetObject);
        EventBus.$emit('spellCastFinish');
      }, castTime);
    } else {
      performSpellAction(spellObject, targetObject);
      EventBus.$emit('spellCastFinish');
    }
  },
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
