
import RaidMemberModel from '../../RaidMemberModel';
import { classifications } from '../../raiderClassifications';

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
          healthPoints = 500;
          maxHealth = 500;
          damageValue = 1;
          break;
        case 2:
          classification = classifications.YOU;
          healthPoints = 250;
          maxHealth = 250;
          break;
        case 3:
        case 4:
          classification = classifications.HEALER;
          healthPoints = 200;
          maxHealth = 200;
          healingValue = 20;
          break;
        default:
          classification = classifications.DPS;
          healthPoints = 150;
          maxHealth = 150;
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
};
