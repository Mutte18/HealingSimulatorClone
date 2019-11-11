import {RaiderHelper} from "../RaiderHelper";

test('can clear boss aggro targets', () => {
  const raiders = RaiderHelper.createRaiders(20);
  RaiderHelper.clearBossAggroTargets(raiders);
});
