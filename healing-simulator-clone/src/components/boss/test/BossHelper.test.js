import {BossHelper} from "../BossHelper";

test('initBoss list creates all bosses', () => {
  const bossList = BossHelper.initBossList();
  expect(bossList.length).toBe(5);
});
