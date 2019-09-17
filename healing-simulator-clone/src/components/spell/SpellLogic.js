import { EventBus } from '../../main';
import {ArrayHelper} from "../../Helpers/ArrayHelper";

let castTimeout;

export const SpellLogic = {
  castSpell(target, spellObject, isCasting, internalCooldownActive, playerManaPoints, raidMembers){
    if (!this.canCastSpell(target, spellObject, isCasting, internalCooldownActive, playerManaPoints)) {
      return false;
    }
    if (spellObject.castTime > 0) {
      emitStartSpellCast(spellObject);
      castTimeout = setTimeout(() => {
        const result = performSpellAction(spellObject, getHealingTargets(
          raidMembers,
          target,
          spellObject.targetAmount)
        );
        emitFinishSpellCast(result);
      }, spellObject.castTime);
    }
    // TODO HOW CAN I GENERELIZE THIS? APPLY D.R.Y PRINCICPLE
    else {
      emitStartSpellCast(spellObject);
      const result = performSpellAction(spellObject, getHealingTargets(
        raidMembers,
        target,
        spellObject.targetAmount)
      );
      emitFinishSpellCast(result);
    }
    return true;
  },

  cancelCast() {
    clearTimeout(castTimeout);
    console.log('clearade timeout');
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

function emitFinishSpellCast(spellObject) {
  EventBus.$emit('finishSpellCast', spellObject);
}

function emitStartSpellCast(spellObject) {
  EventBus.$emit('startSpellCast', spellObject);
}

function getHealingTargets(raidMembers, target, targetAmount) {
  if (targetAmount === 1) {
    return [target];
  }
  // This should return 4 of the raiders with the lowest amount of hp, that are still alive
  let raiders = Array.from(raidMembers);
  //Remove the cast target from the array
  raiders.splice(raiders.indexOf(target), 1);
  raiders = ArrayHelper.shuffleArray(raiders);

  // Remove the raiders that are dead or are on 0 hp. So that they are not chosen as heal targets
  const aliveRaiders = raiders.filter((raider) =>
    raider.getIsAlive() && raider.getHealthPoints() > 0);

  const healingTargets = [];
  for (let i = 0; i < targetAmount; i++) {
    const lowestHpRaider = ArrayHelper.getLowestHPRaider(aliveRaiders);
    if (lowestHpRaider !== undefined) {
      healingTargets.push(lowestHpRaider);
      aliveRaiders.splice(aliveRaiders.indexOf(lowestHpRaider), 1);
    }
  }
  //Add the cast target back to the array
  healingTargets.push(target);
  console.log(healingTargets, "Greger");
  return healingTargets;
}
