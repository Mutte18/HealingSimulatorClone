import BossModel from "../BossModel.js";

function createNewBoss() {
  return new BossModel({
    id: 1,
    name: 'greger',
    portrait: 'kalle.jpg',
    healthPoints: 100,
    maxHealth: 100,
    isAlive: true,
    minDamage: 1,
    maxDamage: 2,
    attackSpeed: 1000,
    critChance: 0.25,
    currentTarget: null,
    isHovered: null
  });
}

test('bossModel getters work', () => {
  const boss = createNewBoss();

  expect(boss.getId()).toBe(boss.id);
  expect(boss.getName()).toBe(boss.name);
  expect(boss.getPortrait()).toBe(boss.portrait);
  expect(boss.getHealthPoints()).toBe(boss.healthPoints);
  expect(boss.getMaxHealth()).toBe(boss.maxHealth);
  expect(boss.getIsAlive()).toBe(boss.isAlive);
  expect(boss.getMinDamage()).toBe(boss.minDamage);
  expect(boss.getMaxDamage()).toBe(boss.maxDamage);
  expect(boss.getAttackSpeed()).toBe(boss.attackSpeed);
  expect(boss.getCritChance()).toBe(boss.critChance);
  expect(boss.getCurrentTarget()).toBe(boss.currentTarget);
  expect(boss.getIsHovered()).toBe(boss.isHovered);
});

test('check full health', () => {
  const boss = createNewBoss();

  expect(boss.getIsFullHealth()).toBe(true);
});

test('reduce health reduces correct amount', () => {
  const boss = createNewBoss();
  boss.reduceHealthPoints(50);
  expect(boss.getHealthPoints()).toBe(50);
  expect(boss.getIsAlive()).toBe(true);
});

test('health below 0 sets alive to false', () => {
  const boss = createNewBoss();
  boss.reduceHealthPoints(boss.maxHealth);
  expect(boss.getHealthPoints()).toBe(0);
  expect(boss.getIsAlive()).toBe(false);
});

test('increase health points doesnt overflow', () => {
  const boss = createNewBoss();
  boss.setHealthPoints(50);
  expect(boss.getHealthPoints()).toBe(50);

  boss.increaseHealthPoints(10);
  expect(boss.getHealthPoints()).toBe(60);

  boss.increaseHealthPoints(100);
  expect(boss.getHealthPoints()).toBe(100);
});

test('reset boss sets health to max and alive to true', () => {
  const boss = createNewBoss();
  boss.setHealthPoints(0);
  boss.setIsAlive(false);
  expect(boss.getIsAlive()).toBe(false);

  boss.resetBoss();

  expect(boss.getHealthPoints()).toBe(boss.getMaxHealth());
  expect(boss.getIsAlive()).toBe(true);
});

test('set current target', () => {
  const boss = createNewBoss();
  boss.setCurrentTarget('kalle');
  expect(boss.getCurrentTarget()).toBe('kalle');
});

test('set is hovered', () => {
  const boss = createNewBoss();
  boss.setIsHovered(true);
  expect(boss.getIsHovered()).toBe(true);
});



