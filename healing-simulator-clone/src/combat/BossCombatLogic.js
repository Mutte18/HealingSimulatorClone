import { classifications } from '../raiderClassifications';
import { ArrayHelper } from '../Helpers/ArrayHelper';

export const BossCombatLogic = {
  bossNormalAttack(raidMembers, boss) {
    let target;
    if (checkBossTargetAliveStatus(boss)) {
      target = boss.getCurrentTarget();
    } else {
      target = retrieveTarget(raidMembers, boss);
    }
    const damage = getNormalAttackDamage(
      boss.getMinDamage(),
      boss.getMaxDamage(),
      boss.getCritChance()
    );
    if (target !== null) {
      target.reduceHealthPoints(damage);
    }
  },

};

function checkBossTargetAliveStatus(boss) {
  if (boss.currentTarget !== null) {
    return boss.currentTarget.getIsAlive();
  }
}
function retrieveTarget(raidMembers, boss) {
  let targets = Array.from(getAliveRaiders(raidMembers));
  if (targets.length > 0) {
    for (let i = 0; i < targets.length; i++) {
      let raider = targets[i];
      console.log(raider.classification);
      // Prioritise attacking tanks
      if (raider.getClassification() === classifications.TANK) {
        console.log(raider, raider.getClassification());
        setBossTarget(boss, raider);
        return raider;
      }
      // If no tanks are found, shuffle the targets list to get a random target (tanks are two first in array)

      targets = ArrayHelper.shuffleArray(targets);
      raider = targets[i];
      setBossTarget(boss, raider);
      return raider;
    }
  }
  // If no target is found, return null
  return null;
}

function setBossTarget(boss, raider) {
  boss.setCurrentTarget(raider);
}

function getNormalAttackDamage(minDamage, maxDamage, critChance) {
  let damage = Math.floor(Math.random() * (maxDamage - minDamage + 1) + minDamage);
  if (checkIfCrit(critChance)) {
    damage = damage * 2;
    console.log("CRIT!");
  }
  console.log(damage);
  return damage;
}

function checkIfCrit(critChance) {
  return critChance >= Math.floor(Math.random() * (100 - 1 + 1));
}

function getAliveRaiders(raidMembers) {
  return raidMembers.filter((raider) => raider.getIsAlive());
}
