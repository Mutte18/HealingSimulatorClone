import {RaiderHelper} from "../RaiderHelper";
import RaidMemberModel from "../RaidMemberModel";
import { classifications } from '../../../raiderClassifications';


function createRaiders(raidSize) {
  return RaiderHelper.createRaiders(raidSize);
}

test('can clear boss aggro targets', () => {
  const raiders = createRaiders(20);
  //RaiderHelper.clearBossAggroTargets(raiders);

  expect(raiders.every((raider) => {
    return raider instanceof RaidMemberModel;
    })
  ).toBe(true);
});

test('createRaiders adds correct amount of raiders', () => {
  const raiders = createRaiders(1000);
  expect(raiders.length).toBe(1000);
});

test('clearBossAggroTargets sets all aggro to false', () => {
  const raiders = createRaiders(1000);
  RaiderHelper.clearBossAggroTargets(raiders);

  expect(raiders.every((raider) => {
    return raider.getHasBossAggro();
  })).toBe(false);

});

test('verify there is only 2 tanks and one player', () => {
  const raiders = createRaiders(1000);
  const tanksCount = raiders.filter(raider => raider.getClassification() === classifications.TANK);
  const playerCount = raiders.filter(raider => raider.getClassification() === classifications.YOU);
  expect(tanksCount.length).toBe(2);
  expect(playerCount.length).toBe(1);
})
