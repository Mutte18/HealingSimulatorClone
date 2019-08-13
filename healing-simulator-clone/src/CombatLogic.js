import {classifications} from "./raiderClassifications";

export const CombatLogic = {
  npcHealRaiders: function(raidMembers){
    raidMembers.forEach(raider => {
      if(raider.getClassification() === classifications.HEALER && raider.getIsAlive()){
        healRaider(raidMembers);
      }
    })
  },
  raidersInflictDamage: function(raidMembers, bossHealth){
    let damage = 0;
    raidMembers.forEach(raider => {
      if(raider.getClassification() === classifications.DPS && raider.getIsAlive()){
        damage++;
      }
    });
    return damage;
  },
  bossCauseDamage: function(raidMembers){
    raidMembers.forEach(raider => {
      if(raider.getIsAlive()){

      }
    })
  }
};

function healRaider(raidMembers){
  raidMembers.forEach(raider => {
    if(raider.getIsAlive()){
      raider.increaseHealthPoints(10);
    }
  })
}

function raiderDealDamage(bossHealth){
  return 1;
}
