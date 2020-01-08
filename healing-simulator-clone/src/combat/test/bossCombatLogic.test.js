import BossModel from "../../components/boss/BossModel";
import {RaiderHelper} from "../../components/raider/RaiderHelper";
import {BossCombatLogic} from "../BossCombatLogic";
import {BossHelper} from "../../components/boss/BossHelper";
import {classifications} from "../../raiderClassifications";

function createBoss() {
  return new BossModel({
    healthPoints: 100,
    maxHealth: 100,
    isAlive: true,
    minDamage: 1,
    maxDamage: 10,
    critChance: 15,
    currentTarget: null
  })
}

function createRaiders() {
  return RaiderHelper.createRaiders(20);
}
/*
this.id = boss.id;
    this.name = boss.name;
    this.portrait = boss.portrait;
    this.healthPoints = boss.healthPoints;
    this.maxHealth = boss.maxHealth;
    this.isAlive = boss.isAlive;
    this.minDamage = boss.minDamage;
    this.maxDamage = boss.maxDamage;
    this.attackSpeed = boss.attackSpeed;
    this.critChance = boss.critChance;
    this.currentTarget = boss.currentTarget;
    this.isHovered = boss.isHovered;
 */

test('boss attacks current target if target still alive', () => {
  const boss = createBoss();
  const raiders = createRaiders();

  boss.setCurrentTarget(raiders[0]);
  const currentTarget = boss.getCurrentTarget();
  BossCombatLogic.bossNormalAttack(raiders, boss);
  expect(boss.getCurrentTarget()).toBe(currentTarget);
});

test('boss changes target if last target is dead', () => {
  const boss = createBoss();
  const raiders = createRaiders();

  boss.setCurrentTarget(raiders[0]);
  raiders[0].setIsAlive(false);

  const oldTarget = boss.getCurrentTarget();

  BossCombatLogic.bossNormalAttack(raiders, boss);
  const expectedTarget = boss.getCurrentTarget();

  expect(boss.getCurrentTarget()).not.toBe(oldTarget);
  expect(boss.getCurrentTarget()).toBe(expectedTarget);
});

test('retrieve target prioritieses tanks if alive', () => {
  const boss = createBoss();
  const raiders = createRaiders();

  BossCombatLogic.bossNormalAttack(raiders, boss);
  expect(boss.getCurrentTarget().getClassification()).toBe(classifications.TANK);

  raiders[0].setIsAlive(false);

  BossCombatLogic.bossNormalAttack(raiders, boss);
  expect(boss.getCurrentTarget().getClassification()).toBe(classifications.TANK);

  raiders[1].setIsAlive(false);

  BossCombatLogic.bossNormalAttack(raiders, boss);
  expect(boss.getCurrentTarget().getClassification()).not.toBe(classifications.TANK);
});

test('no target if raiders is empty', () => {
  const boss = createBoss();

  BossCombatLogic.bossNormalAttack([], boss);
  const expectedCurrentTarget = boss.getCurrentTarget();
  expect(expectedCurrentTarget).toBe(null);
});

