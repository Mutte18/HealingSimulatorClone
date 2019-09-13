export const SpellList = {
  initializeSpells(){
    return [
      {
        name: spellNames.HEAL,
        icon: 'heal.png',
        healAmount: 25,
        manaCost: 50,
        castTime: 2000,
        cooldown: 5,
        targetAmount: 1,
        isHovered: false
      },
      {
        name: spellNames.FLASH_HEAL,
        icon: 'flash_heal.png',
        healAmount: 45,
        manaCost: 90,
        castTime: 1500,
        cooldown: 3,
        targetAmount: 1,
        isHovered: false
      },
      {
        name: spellNames.CIRCLE_OF_HEALING,
        icon: 'circle_of_healing.png',
        healAmount: 150,
        manaCost: 150,
        castTime: 1000,
        cooldown: 4,
        targetAmount: 4,
        isHovered: false
      },
      {
        name: spellNames.RENEW,
        icon: 'renew.png',
        healAmount: -50,
        manaCost: 50,
        castTime: 0,
        cooldown: 1,
        targetAmount: 1,
        isHovered: false
      },
      {
        name: spellNames.DISPEL,
        icon: 'dispel.png',
        healAmount: 10,
        manaCost: 50,
        castTime: 0,
        cooldown: 1,
        targetAmount: 1,
        isHovered: false
      },
      {
        name: spellNames.HOLY_SHOCK,
        icon: 'dispel.png',
        healAmount: 125,
        manaCost: 50,
        castTime: 0,
        cooldown: 5,
        targetAmount: 1,
        isHovered: false
      }
    ];
  }
};

export const spellNames = {
  HEAL: 'Heal',
  FLASH_HEAL: 'Flash heal',
  CIRCLE_OF_HEALING: 'Circle of Healing',
  RENEW: 'Renew',
  DISPEL: 'Dispel',
  HOLY_SHOCK: 'Holy Shock'
};
