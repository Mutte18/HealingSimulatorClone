import {classifications} from "../raiderClassifications";
import {ArrayHelper} from "../Helpers/ArrayHelper";

export const BossCombatLogic = {
  bossNormalAttack(raidMembers, boss){
    const target = retrieveTarget(raidMembers);
    console.log(target, 'TARGET');
    const damage = getNormalAttackDamage(boss.minDamage, boss.maxDamage);
    if(target !== null) {
      target.reduceHealthPoints(damage);
    }
  }
};

function retrieveTarget(raidMembers){
  let targets = Array.from(getAliveRaiders(raidMembers));
  if(targets.length > 0) {
    for (let i = 0; i < targets.length; i++) {
      let raider = targets[i];
      console.log(raider.classification);
      //Prioritise attacking tanks
      if (raider.getClassification() === classifications.TANK) {
        console.log(raider, raider.getClassification());
        return raider;
      }
      //If no tanks are found, shuffle the targets list to get a random target (tanks are two first in array)
      else {
        targets = ArrayHelper.shuffleArray(targets);
        raider = targets[i];
        return raider;
      }
    }
  }
  //If no target is found, return null
  return null;

}

function getNormalAttackDamage(minDamage, maxDamage){
  return Math.floor(Math.random() * (maxDamage - minDamage + 1) + minDamage);
}

function getAliveRaiders(raidMembers){
  return raidMembers.filter((raider) => {
    return raider.getIsAlive();
  })
}


