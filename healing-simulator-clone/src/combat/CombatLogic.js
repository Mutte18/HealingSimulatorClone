import {classifications} from "../raiderClassifications";

export const CombatLogic = {
  npcHealRaiders: function(raidMembers){
    raidMembers.forEach(raider => {
      if(raider.getClassification() === classifications.HEALER && raider.getIsAlive()){
        healRaider(raidMembers);
      }
    })
  },
  raidersInflictDamage: function(raidMembers){
    let damage = 0;
    raidMembers.forEach(raider => {
      if(raider.getIsAlive()){
        damage += raider.getDamageValue();
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
