import BossModel from "./BossModel";
const assetsPath = `healing-simulator-clone/src/assets/murloc_boss.jpg`;
export const BossHelper = {
  initBossList() {
    return [
      new BossModel({
        id: 0,
        name: bossNames.MIGHTY_MURLOC,
        portrait: 'murloc_boss.jpg',
        healthPoints: 2500,
        maxHealth: 2500,
        isAlive: true,
        minDamage: 50,
        maxDamage: 75,
        attackSpeed: 2000,
        critChance: 0.15,
        currentTarget: null
    }),
      new BossModel({
        id: 1,
        name: bossNames.DEFIAS_PILLAGER,
        portrait: 'defias_pillager.png',
        healthPoints: 5000,
        maxHealth: 5000,
        isAlive: true,
        minDamage: 200,
        maxDamage: 400,
        attackSpeed: 3000,
        critChance: 15,
        currentTarget: null
      }),
      new BossModel({
        id: 2,
        name: bossNames.CS_LASSE,
        portrait: 'kalle-vinjett.jpg',
        healthPoints: 7500,
        maxHealth: 7500,
        isAlive: true,
        minDamage: 50,
        maxDamage: 70,
        attackSpeed: 1250,
        critChance: 50,
        currentTarget: null
      }),
      new BossModel({
        id: 3,
        name: bossNames.KUNGEN,
        portrait: 'kungen.png',
        healthPoints: 20000,
        maxHealth: 20000,
        isAlive: true,
        minDamage: 1,
        maxDamage: 1000,
        attackSpeed: 2500,
        critChance: 0,
        currentTarget: null
      }),
      new BossModel({
        id: 4,
        name: bossNames.FATALBERT,
        portrait: 'fatalbert.png',
        healthPoints: 50000,
        maxHealth: 50000,
        isAlive: true,
        minDamage: 1000,
        maxDamage: 3000,
        attackSpeed: 100,
        critChance: 75,
        currentTarget: null
      }),
    ]
  }
};

const bossNames = {
  MIGHTY_MURLOC: 'Mighty Murloc',
  DEFIAS_PILLAGER: 'Defias Pillager',
  CS_LASSE: 'Cs Lasse',
  KUNGEN: 'Kungen',
  FATALBERT: 'Fatalbert'
};

