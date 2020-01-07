import RaidMemberModel from "../RaidMemberModel.js";

function createNewRaider() {
  return new RaidMemberModel({
    id: 1,
    healthPoints: 100,
    maxHealth: 100,
    isAlive: true,
    isTargeted: false,
    hasBossAggro: false,
    classification: '',
    damageValue: 10,
    healingValue: 10
  });
}

test('raidMemberModel getters work', () => {
  const raidMember = createNewRaider();

  expect(raidMember.getId()).toBe(raidMember.id);
  expect(raidMember.getHealthPoints()).toBe(raidMember.healthPoints);
  expect(raidMember.getMaxHealth()).toBe(raidMember.maxHealth);
  expect(raidMember.getIsAlive()).toBe(raidMember.isAlive);
  expect(raidMember.getIsTargeted()).toBe(raidMember.isTargeted);
  expect(raidMember.getHasBossAggro()).toBe(raidMember.hasBossAggro);
  expect(raidMember.getClassification()).toBe(raidMember.classification);
  expect(raidMember.getDamageValue()).toBe(raidMember.damageValue);
  expect(raidMember.getHealingValue()).toBe(raidMember.healingValue);
});

test('check full health', () => {
  const raidMember = createNewRaider();

  expect(raidMember.getIsFullHealth()).toBe(true);
});

test('reduce health reduces correct amount', () => {
  const raidMember = createNewRaider();
  raidMember.reduceHealthPoints(50);
  expect(raidMember.getHealthPoints()).toBe(50);
  expect(raidMember.getIsAlive()).toBe(true);
});

test('health below 0 sets alive to false', () => {
  const raidMember = createNewRaider();
  raidMember.reduceHealthPoints(raidMember.maxHealth);
  expect(raidMember.getHealthPoints()).toBe(0);
  expect(raidMember.getIsAlive()).toBe(false);
});

test('test setIsAlive', () => {
  const raidMember = createNewRaider();
  raidMember.setIsAlive(false);
  expect(raidMember.getIsAlive()).toBe(false);
});

test('increase health points doesnt overflow', () => {
  const raidMember = createNewRaider();
  raidMember.setHealthPoints(50);
  expect(raidMember.getHealthPoints()).toBe(50);

  raidMember.increaseHealthPoints(10);
  expect(raidMember.getHealthPoints()).toBe(60);

  raidMember.increaseHealthPoints(100);
  expect(raidMember.getHealthPoints()).toBe(100);
});

test('set is target', () => {
  const raidMember = createNewRaider();
  raidMember.setIsTargeted(true);
  expect(raidMember.getIsTargeted()).toBe(true);
});

test('set has bossAggro', () => {
  const raidMember = createNewRaider();
  raidMember.setHasBossAggro(true);
  expect(raidMember.getHasBossAggro()).toBe(true);
});

test('create empty RaidMemberModel', () => {
  const emptyRaidMember = new RaidMemberModel();
});



