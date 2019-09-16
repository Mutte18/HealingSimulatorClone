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

  getAoEHealTargets(raidMembers, target, spellObject) {
    // This should return 4 of the raiders with the lowest amount of hp, that are still alive
    let raiders = Array.from(raidMembers);
    //Remove the cast target from the array
    raiders.splice(raiders.indexOf(target), 1);
    raiders = ArrayHelper.shuffleArray(raiders);

    // Remove the raiders that are dead or are on 0 hp. So that they are not chosen as heal targets
    const aliveRaiders = raiders.filter((raider) =>
      raider.getIsAlive() && raider.getHealthPoints() > 0);

    const healingTargets = [];
    for (let i = 0; i < spellObject.targetAmount; i++) {
      const lowestHpRaider = getLowestHPRaider(aliveRaiders);
      if (lowestHpRaider !== undefined) {
        healingTargets.push(lowestHpRaider);
        aliveRaiders.splice(aliveRaiders.indexOf(lowestHpRaider), 1);
      }
    }
    //Add the cast target back to the array
    healingTargets.push(target);
    console.log(healingTargets);
    return healingTargets;
  },

  dealInstantRaidDamage(raidMembers){
    raidMembers.forEach((raidMember) => {
      const damageAmount = raidMember.getMaxHealth() / 2;
      raidMember.reduceHealthPoints(damageAmount);
    });
  }
};

function getLowestHPRaider(unsortedRaiders) {
  let lowest = unsortedRaiders[0];
  for (let i = 1; i < unsortedRaiders.length; i++) {
    if (unsortedRaiders[i].healthPoints < lowest.healthPoints) {
      lowest = unsortedRaiders[i];
    }
  }
  return lowest;
}
