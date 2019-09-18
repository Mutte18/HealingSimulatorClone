import { EventBus } from '../../main';
import {ArrayHelper} from "../../Helpers/ArrayHelper";

let castTimeout;

export const SpellLogic = {
  castSpell(target, spellObject, isCasting, internalCooldownActive, playerManaPoints, raidMembers){
    if (!this.canCastSpell(target, spellObject, isCasting, internalCooldownActive, playerManaPoints)) {
      return false;
    }
    emitStartSpellCast(spellObject);
    castTimeout = setTimeout(() => finishSpellCast(target, spellObject, raidMembers), spellObject.castTime);
    return true;
  },

  cancelCast() {
    clearTimeout(castTimeout);
  },
  canCastSpell(target, spellObject, isCasting, internalCooldownActive, playerMana) {
    return target
      && target.getIsAlive()
      && !isCasting
      && this.checkIfEnoughManaForCast(playerMana, spellObject.manaCost)
      && !internalCooldownActive;
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
  targetObjects.forEach((target) => {
    if (target.getIsAlive()) {
      target.increaseHealthPoints(healValue);
    }
  });
  return spellObject;
}

function finishSpellCast(target, spellObject, raidMembers) {
  const targetsToHeal = getHealingTargets(raidMembers, target, spellObject.extraTargets);
  const result = performSpellAction(spellObject, targetsToHeal);
  emitFinishSpellCast(result);
}

function emitFinishSpellCast(spellObject) {
  EventBus.$emit('finishSpellCast', spellObject);
}

function emitStartSpellCast(spellObject) {
  EventBus.$emit('startSpellCast', spellObject);
}

function getHealingTargets(raidMembers, target, extraTargets) {
  if (extraTargets === 0) {
    return [target];
  }
  // This should return 4 of the raiders with the lowest amount of hp, that are still alive
  let raiders = Array.from(raidMembers);
  //Remove the cast target from the array
  raiders.splice(raiders.indexOf(target), 1);
  raiders = ArrayHelper.shuffleArray(raiders);

  // Remove the raiders that are dead or are on 0 hp. So that they are not chosen as heal targets
  const aliveRaiders = raiders.filter((raider) =>
    (raider.getIsAlive() && raider.getHealthPoints() > 0 && !raider.getIsFullHealth()));

  const healingTargets = [];
  for (let i = 0; i < extraTargets; i++) {
    const lowestHpRaider = ArrayHelper.getLowestHPRaider(aliveRaiders);
    if (lowestHpRaider !== undefined) {
      healingTargets.push(lowestHpRaider);
      aliveRaiders.splice(aliveRaiders.indexOf(lowestHpRaider), 1);
    }
  }
  //Add the cast target back to the array
  healingTargets.push(target);
  return healingTargets;
}
