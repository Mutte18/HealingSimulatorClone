export const ArrayHelper = {
  shuffleArray(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  },
  getLowestHPRaider(unsortedRaiders) {
    let lowest = unsortedRaiders[0];
    for (let i = 1; i < unsortedRaiders.length; i++) {
      if (unsortedRaiders[i].healthPoints < lowest.healthPoints) {
        lowest = unsortedRaiders[i];
      }
    }
    return lowest;
  },

  dealInstantRaidDamage(raidMembers){
    raidMembers.forEach((raidMember) => {
      const damageAmount = raidMember.getMaxHealth() / 2;
      raidMember.reduceHealthPoints(damageAmount);
    });
  }
};
