

import { classifications } from '../../raiderClassifications';
import RaidMemberModel from "./RaidMemberModel";

export const RaiderHelper = {
  createRaiders(raidSize) {
    const raidMembers = [];

    for (let i = 0; i < raidSize; i++) {
      let classification;
      let healthPoints;
      let maxHealth;
      let damageValue = 0;
      let healingValue = 0;
      switch (i) {
        case 0:
        case 1:
          classification = classifications.TANK;
          healthPoints = 2000;
          maxHealth = 2000;
          damageValue = 1;
          break;
        case 2:
          classification = classifications.YOU;
          healthPoints = 1500;
          maxHealth = 1500;
          break;
        case 3:
        case 4:
          classification = classifications.HEALER;
          healthPoints = 1000;
          maxHealth = 1000;
          healingValue = 20;
          break;
        default:
          classification = classifications.DPS;
          healthPoints = 800;
          maxHealth = 800;
          damageValue = 3;
          break;
      }
      raidMembers.push(new RaidMemberModel({
        id: i,
        healthPoints,
        maxHealth,
        isAlive: true,
        isTargeted: false,
        classification,
        damageValue,
        healingValue,
      }));
    }
    return raidMembers;
  },

  clearBossAggroTargets(raidMembers) {
    raidMembers.forEach((raider) => {
      raider.setHasBossAggro(false);
    })
  }
};
