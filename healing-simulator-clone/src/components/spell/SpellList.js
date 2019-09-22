import SpellModel from "./SpellModel";

export const spellNames = {
  HEAL: 'Heal',
  FLASH_HEAL: 'Flash heal',
  CIRCLE_OF_HEALING: 'Circle of Healing',
  RENEW: 'Renew',
  DISPEL: 'Dispel',
  HOLY_SHOCK: 'Holy Shock',
  BINDING_HEAL: 'Binding Heal'
};

export const SpellList = {
  initializeSpells() {
    return [
      new SpellModel({
        name: spellNames.HEAL,
        icon: 'heal.png',
        healAmount: 25,
        manaCost: 50,
        castTime: 2000,
        cooldown: 5,
        extraTargets: 0,
        isHovered: false,
      }),
      new SpellModel({
        name: spellNames.FLASH_HEAL,
        icon: 'flash_heal.png',
        healAmount: 45,
        manaCost: 90,
        castTime: 1500,
        cooldown: 3,
        extraTargets: 0,
        isHovered: false,}),
      new SpellModel({
        name: spellNames.CIRCLE_OF_HEALING,
        icon: 'circle_of_healing.png',
        healAmount: 150,
        manaCost: 150,
        castTime: 1000,
        cooldown: 4,
        extraTargets: 4,
        isHovered: false,
      }),
      new SpellModel({
        name: spellNames.RENEW,
        icon: 'renew.png',
        healAmount: -50,
        manaCost: 50,
        castTime: 0,
        cooldown: 1,
        extraTargets: 0,
        isHovered: false,
      },),
      new SpellModel({
        name: spellNames.DISPEL,
        icon: 'dispel.png',
        healAmount: 10,
        manaCost: 50,
        castTime: 0,
        cooldown: 1,
        extraTargets: 0,
        isHovered: false,
      }),
      new SpellModel({
        name: spellNames.HOLY_SHOCK,
        icon: 'dispel.png',
        healAmount: 125,
        manaCost: 50,
        castTime: 0,
        cooldown: 5,
        extraTargets: 0,
        isHovered: false,
      }),
      new SpellModel({
        name: spellNames.BINDING_HEAL,
        icon: 'dispel.png',
        healAmount: 125,
        manaCost: 50,
        castTime: 500,
        cooldown: 5,
        extraTargets: 1,
        isHovered: false,
      }),
    ];
  },
};
