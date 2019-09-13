export const Player = {
  checkIfEnoughManaForCast(spellObject) {
    return this.getPlayerMana().manaPoints - spellObject.manaCost > 0;
  },
  getPlayerMana(){
    return playerObject.mana;
  },
  getPlayerTarget(){
    return playerObject.target;
  },
  getPlayerSpell(){
    return playerObject.spell;
  }
};

















